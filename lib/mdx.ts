'use server';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { getHighlighter } from 'shiki';

import type { HolisticPillar } from '@/lib/types';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export interface CompiledPost {
  meta: Record<string, any>;
  code: string;
  headings: { depth: number; text: string; slug: string }[];
  excerpt: string;
  interactiveHtml?: string | null;
}

interface ArticleRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[] | null;
  hero_image: string | null;
  interactive_slug: string | null;
  body_mdx: string | null;
  published_at: string | null;
  status: string | null;
  interactive_html: string | null;
  is_listed?: boolean | null;
}

function extractHeadings(content: string) {
  const headingRegex = /^##\s+(.+)$|^###\s+(.+)$/gm;
  const headings: { depth: number; text: string; slug: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = (match[1] || match[2] || '').trim();
    const depth = match[1] ? 2 : 3;
    const headingSlug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ depth, text, slug: headingSlug });
  }
  return headings;
}

function buildExcerpt(content: string, provided?: unknown): string {
  if (typeof provided === 'string' && provided.trim()) {
    return provided.trim();
  }
  const plain = content
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .replace(/[*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.slice(0, 220) + (plain.length > 220 ? '…' : '');
}

async function compileMdx(source: string) {
  const highlighter = await getHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: ['javascript', 'typescript', 'tsx', 'bash', 'json', 'markdown']
  });

  const transformed = source.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match: string, lang?: string, codeBlock?: string) => {
    const language = (lang || 'text').toLowerCase();
    const block = codeBlock ?? '';
    try {
      const htmlLight = highlighter.codeToHtml(block.trim(), { lang: language, theme: 'github-light' });
      const htmlDark = highlighter.codeToHtml(block.trim(), { lang: language, theme: 'github-dark' });
      return `\n<div class="code-block not-prose"><div class="hidden dark:block">${htmlDark}</div><div class="dark:hidden">${htmlLight}</div></div>\n`;
    } catch {
      return _match;
    }
  });

  const compiled = await compile(transformed, {
    outputFormat: 'function-body',
    development: false,
    jsxRuntime: 'automatic',
    remarkPlugins: [remarkGfm]
  });

  return String(compiled);
}

async function getPostFromSupabase(slug: string): Promise<CompiledPost | null> {
  const supabase = getSupabaseServiceClient();
  const { data: article, error } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, category, tags, hero_image, interactive_slug, body_mdx, published_at, status, interactive_html, is_listed')
    .eq('slug', slug)
    .maybeSingle<ArticleRecord>();

  if (error) {
    throw new Error(`Failed to fetch article: ${error.message}`);
  }

  if (!article || !article.body_mdx || article.status !== 'published' || article.is_listed === false) {
    return null;
  }

  const [{ data: pivotRows, error: pivotError }, { data: pillarRows, error: pillarError }] = await Promise.all([
    supabase.from('article_pillars').select('pillar_id').eq('article_id', article.id),
    supabase.from('pillars').select('id, slug')
  ]);

  if (pivotError) {
    throw new Error(`Failed to load article pillars: ${pivotError.message}`);
  }
  if (pillarError) {
    throw new Error(`Failed to load pillars: ${pillarError.message}`);
  }

  const pillarSet = new Set((pivotRows ?? []).map((pivot) => pivot.pillar_id));
  const pillarSlugs =
    pillarRows?.filter((row) => pillarSet.has(row.id)).map((row) => row.slug as HolisticPillar) ?? undefined;

  const body = article.body_mdx.trim();
  const headings = extractHeadings(body);
  const code = await compileMdx(body);
  const excerpt = buildExcerpt(body, article.excerpt ?? undefined);

  const meta: Record<string, any> = {
    title: article.title,
    excerpt: article.excerpt ?? undefined,
    category: article.category ?? undefined,
    tags: article.tags ?? undefined,
    date: article.published_at ? new Date(article.published_at).toISOString() : undefined,
    interactive: article.interactive_slug ?? undefined,
    heroImage: article.hero_image ?? undefined,
    pillars: pillarSlugs
  };

  return { meta, code, headings, excerpt, interactiveHtml: article.interactive_html ?? null };
}

async function getPostFromFilesystem(slug: string): Promise<CompiledPost | null> {
  const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`);
  let source: string;
  try {
    source = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }

  const { data, content } = matter(source);
  const trimmed = content.trim();

  if (!trimmed) {
    return null;
  }

  const headings = extractHeadings(trimmed);
  const code = await compileMdx(trimmed);
  const excerpt = buildExcerpt(trimmed, data.excerpt);

  const meta: Record<string, any> = {
    title: typeof data.title === 'string' ? data.title : slug,
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : undefined,
    category: typeof data.category === 'string' ? data.category : undefined,
    tags: Array.isArray(data.tags) ? data.tags.filter((tag: unknown): tag is string => typeof tag === 'string') : undefined,
    date: data.date ? new Date(data.date).toISOString() : undefined,
    interactive: typeof data.interactive === 'string' ? data.interactive : undefined,
    heroImage: typeof data.cover === 'string' ? data.cover : undefined,
    pillars: Array.isArray(data.pillars)
      ? (data.pillars.filter((item): item is HolisticPillar => typeof item === 'string') as HolisticPillar[])
      : undefined
  };

  const interactiveHtml = typeof data.interactive_html === 'string' ? data.interactive_html : undefined;

  return { meta, code, headings, excerpt, interactiveHtml };
}

export async function getPostMdx(slug: string): Promise<CompiledPost | null> {
  try {
    const supabasePost = await getPostFromSupabase(slug);
    if (supabasePost) {
      return supabasePost;
    }
  } catch (error) {
    console.error('[blog] Falling back to filesystem article:', error);
  }

  return getPostFromFilesystem(slug);
}
