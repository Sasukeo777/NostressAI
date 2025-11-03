'use server';

import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import type { AdminArticleDetail, AdminArticleSummary, HolisticPillar } from '@/lib/types';

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  status: string | null;
  is_listed: boolean | null;
  published_at: string | null;
  category: string | null;
}

export async function listArticlesForAdmin(): Promise<AdminArticleSummary[]> {
  const supabase = getSupabaseServiceClient();

  const [articlesResult, pivotResult, pillarResult] = await Promise.all([
    supabase
      .from('articles')
      .select('id, title, slug, status, is_listed, published_at, category')
      .order('published_at', { ascending: false })
      .order('title', { ascending: true }),
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

  const articles = (articlesResult.data ?? []) as ArticleRow[];
  const pivotRows = pivotResult.data ?? [];
  const pillarRows = pillarResult.data ?? [];

  const pillarMap = new Map<string, HolisticPillar>();
  pillarRows.forEach((row) => {
    pillarMap.set(row.id, row.slug as HolisticPillar);
  });

  const articlePillars = new Map<string, HolisticPillar[]>();
  pivotRows.forEach((pivot) => {
    const slug = pillarMap.get(pivot.pillar_id);
    if (!slug) return;
    const list = articlePillars.get(pivot.article_id) ?? [];
    list.push(slug);
    articlePillars.set(pivot.article_id, list);
  });

  return articles.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: (row.status as AdminArticleSummary['status']) ?? null,
    isListed: row.is_listed !== false,
    publishedAt: row.published_at,
    category: row.category,
    pillars: articlePillars.get(row.id) ?? []
  }));
}

export async function getArticleForEdit(slug: string): Promise<AdminArticleDetail | null> {
  const supabase = getSupabaseServiceClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select(
      'id, title, slug, status, is_listed, published_at, category, excerpt, tags, hero_image, interactive_slug, interactive_html, body_mdx'
    )
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load article: ${error.message}`);
  }
  if (!article || !article.body_mdx) {
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
  const pillars = pillarRows
    ?.filter((row) => pillarSet.has(row.id))
    .map((row) => row.slug as HolisticPillar) ?? [];

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    status: (article.status as AdminArticleSummary['status']) ?? null,
    isListed: article.is_listed !== false,
    publishedAt: article.published_at,
    category: article.category,
    excerpt: article.excerpt,
    tags: article.tags,
    heroImage: article.hero_image,
    interactiveSlug: article.interactive_slug,
    interactiveHtml: article.interactive_html,
    body: article.body_mdx,
    pillars
  };
}
