'use server';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

import type { BlogMeta, HolisticPillar } from '@/lib/types';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string | null;
  status: string | null;
  interactive_slug: string | null;
  interactive_html: string | null;
  is_listed?: boolean | null;
}

function normaliseDate(value: unknown): string {
  if (!value) return new Date().toISOString();
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function createExcerpt(rawContent: string, frontmatterExcerpt?: unknown): string | undefined {
  if (typeof frontmatterExcerpt === 'string' && frontmatterExcerpt.trim()) {
    return frontmatterExcerpt.trim();
  }
  const plain = rawContent
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .replace(/[*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return undefined;
  return plain.slice(0, 180) + (plain.length > 180 ? '…' : '');
}

function mapArticleRow(row: ArticleRow, pillars?: HolisticPillar[]): BlogMeta {
  return {
    slug: row.slug,
    title: row.title,
    date: row.published_at ? new Date(row.published_at).toISOString() : new Date().toISOString(),
    excerpt: row.excerpt ?? undefined,
    category: row.category ?? undefined,
    tags: row.tags ?? undefined,
    pillars
  };
}

async function fetchPostsFromSupabase(): Promise<BlogMeta[]> {
  const supabase = getSupabaseServiceClient();

  const [articlesResult, pivotResult, pillarResult] = await Promise.all([
    supabase
      .from('articles')
      .select('id, slug, title, excerpt, category, tags, published_at, status, interactive_slug, interactive_html, is_listed')
      .order('published_at', { ascending: false }),
    supabase.from('article_pillars').select('article_id, pillar_id'),
    supabase.from('pillars').select('id, slug')
  ]);

  if (articlesResult.error) {
    throw new Error(`Failed to load articles: ${articlesResult.error.message}`);
  }
  if (pivotResult.error) {
    throw new Error(`Failed to load article pillars: ${pivotResult.error.message}`);
  }
  if (pillarResult.error) {
    throw new Error(`Failed to load pillars: ${pillarResult.error.message}`);
  }

  const articles = (articlesResult.data ?? []).filter(
    (article) => article.status === 'published' && article.is_listed !== false
  );
  if (!articles.length) {
    return [];
  }

  const pivotRows = pivotResult.data ?? [];
  const pillarRows = pillarResult.data ?? [];

  const pillarMap = new Map<string, HolisticPillar>();
  pillarRows.forEach((row) => {
    pillarMap.set(row.id, row.slug as HolisticPillar);
  });

  const articlePillars = new Map<string, HolisticPillar[]>();
  pivotRows.forEach((pivot) => {
    const pillarSlug = pillarMap.get(pivot.pillar_id);
    if (!pillarSlug) return;
    const list = articlePillars.get(pivot.article_id) ?? [];
    list.push(pillarSlug);
    articlePillars.set(pivot.article_id, list);
  });

  return articles.map((row) => mapArticleRow(row, articlePillars.get(row.id)));
}

async function fetchPostsFromFilesystem(): Promise<BlogMeta[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(BLOG_CONTENT_DIR);
  } catch (error) {
    console.error('[blog] Unable to read blog directory:', error);
    return [];
  }

  const mdxFiles = entries.filter((file) => file.endsWith('.mdx'));

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(/\.mdx$/, '');
      const absolutePath = path.join(BLOG_CONTENT_DIR, file);
      const source = await fs.readFile(absolutePath, 'utf8');
      const { data, content } = matter(source);

      const pillars = Array.isArray(data.pillars)
        ? (data.pillars.filter((item): item is HolisticPillar => typeof item === 'string') as HolisticPillar[])
        : undefined;

      const tags = Array.isArray(data.tags)
        ? data.tags.filter((tag: unknown): tag is string => typeof tag === 'string')
        : undefined;

      const post: BlogMeta = {
        slug,
        title: typeof data.title === 'string' ? data.title : slug,
        date: normaliseDate(data.date),
        excerpt: createExcerpt(content, data.excerpt),
        category: typeof data.category === 'string' ? data.category : undefined,
        tags,
        pillars
      };

      return post;
    })
  );

  return posts.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
}

export async function getAllPosts(): Promise<BlogMeta[]> {
  try {
    const posts = await fetchPostsFromSupabase();
    if (posts.length > 0) {
      return posts;
    }
  } catch (error) {
    console.error('[blog] Falling back to filesystem posts:', error);
  }

  return fetchPostsFromFilesystem();
}
