'use server';

import { revalidatePath } from 'next/cache';

import { getAuthContext } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import { slugify } from '@/lib/utils/slugify';
import type { HolisticPillar } from '@/lib/types';

export interface CreateArticleState {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseTags(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  return tags.length ? tags : undefined;
}

function parsePillars(values: string[]): HolisticPillar[] {
  const set = new Set<HolisticPillar>();
  values.forEach((value) => {
    if (value) {
      set.add(value as HolisticPillar);
    }
  });
  return Array.from(set);
}

export async function createArticle(previousState: CreateArticleState, formData: FormData): Promise<CreateArticleState> {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    return { error: 'Only administrators can create articles.' };
  }

  const title = String(formData.get('title') ?? '').trim();
  const slugInput = String(formData.get('slug') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  const fieldErrors: Record<string, string> = {};

  if (!title) {
    fieldErrors.title = 'Title is required.';
  }

  const generatedSlug = slugify(slugInput || title);
  if (!generatedSlug) {
    fieldErrors.slug = 'Provide a title or slug.';
  }

  if (!body) {
    fieldErrors.body = 'Article content is required.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const excerpt = String(formData.get('excerpt') ?? '').trim() || null;
  const category = String(formData.get('category') ?? '').trim() || null;
  const heroImage = String(formData.get('heroImage') ?? '').trim() || null;
  const interactiveSlug = String(formData.get('interactiveSlug') ?? '').trim() || null;
  const interactiveHtml = String(formData.get('interactiveHtml') ?? '').trim() || null;
  const status = (String(formData.get('status') ?? 'draft') === 'published' ? 'published' : 'draft') as 'draft' | 'published';
  const publishedAtValue = String(formData.get('publishedAt') ?? '').trim();
  const tags = parseTags(String(formData.get('tags') ?? '').trim() || null);
  const pillars = parsePillars(formData.getAll('pillars').map((value) => String(value)));

  const supabase = getSupabaseServiceClient();

  const {
    data: existingArticle,
    error: existingError
  } = await supabase.from('articles').select('id').eq('slug', generatedSlug).maybeSingle();

  if (existingError) {
    return { error: `Unable to verify slug uniqueness: ${existingError.message}` };
  }

  if (existingArticle) {
    return { error: `The slug "${generatedSlug}" is already in use.` };
  }

  let publishedAt: string | null = null;
  if (publishedAtValue) {
    const parsed = new Date(publishedAtValue);
    if (!Number.isNaN(parsed.getTime())) {
      publishedAt = parsed.toISOString();
    }
  }

  const { data: insertedArticle, error: insertError } = await supabase
    .from('articles')
    .insert({
      slug: generatedSlug,
      title,
      excerpt,
      category,
      tags,
      hero_image: heroImage,
      interactive_html: interactiveHtml,
      interactive_slug: interactiveSlug,
      status,
      published_at: publishedAt,
      body_mdx: body
    })
    .select('id')
    .maybeSingle();

  if (insertError) {
    return { error: insertError.message };
  }

  if (insertedArticle?.id && pillars.length > 0) {
    const { data: pillarRows, error: pillarError } = await supabase.from('pillars').select('id, slug');
    if (pillarError) {
      return { error: pillarError.message };
    }

    const slugToId = new Map<string, string>();
    (pillarRows ?? []).forEach((row) => {
      slugToId.set(row.slug, row.id);
    });

    const rows = pillars
      .map((slug) => slugToId.get(slug))
      .filter((pillarId): pillarId is string => Boolean(pillarId))
      .map((pillarId) => ({
        article_id: insertedArticle.id,
        pillar_id: pillarId
      }));

    if (rows.length > 0) {
      const { error: pivotError } = await supabase.from('article_pillars').insert(rows);
      if (pivotError) {
        return { error: pivotError.message };
      }
    }
  }

  revalidatePath('/blog');
  revalidatePath('/admin');
  revalidatePath(`/blog/${generatedSlug}`);

  return {
    success: 'Article created successfully.'
  };
}

export interface UpdateArticleState {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function updateArticle(_: UpdateArticleState, formData: FormData): Promise<UpdateArticleState> {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    return { error: 'Only administrators can update articles.' };
  }

  const articleId = String(formData.get('articleId') ?? '').trim();
  const originalSlug = String(formData.get('originalSlug') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const slugInput = String(formData.get('slug') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  const fieldErrors: Record<string, string> = {};

  if (!articleId) {
    return { error: 'Missing article identifier.' };
  }
  if (!title) {
    fieldErrors.title = 'Title is required.';
  }
  const nextSlug = slugify(slugInput || title);
  if (!nextSlug) {
    fieldErrors.slug = 'Provide a title or slug.';
  }
  if (!body) {
    fieldErrors.body = 'Article content is required.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const excerpt = String(formData.get('excerpt') ?? '').trim() || null;
  const category = String(formData.get('category') ?? '').trim() || null;
  const heroImage = String(formData.get('heroImage') ?? '').trim() || null;
  const interactiveSlug = String(formData.get('interactiveSlug') ?? '').trim() || null;
  const interactiveHtml = String(formData.get('interactiveHtml') ?? '').trim() || null;
  const status = (String(formData.get('status') ?? 'draft') === 'published' ? 'published' : 'draft') as 'draft' | 'published';
  const publishedAtValue = String(formData.get('publishedAt') ?? '').trim();
  const tags = parseTags(String(formData.get('tags') ?? '').trim() || null);
  const pillars = parsePillars(formData.getAll('pillars').map((value) => String(value)));

  let publishedAt: string | null = null;
  if (publishedAtValue) {
    const parsed = new Date(publishedAtValue);
    if (!Number.isNaN(parsed.getTime())) {
      publishedAt = parsed.toISOString();
    }
  }

  const supabase = getSupabaseServiceClient();

  // Ensure slug is unique (excluding current article)
  const { data: conflicting, error: conflictError } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', nextSlug)
    .neq('id', articleId)
    .maybeSingle();

  if (conflictError) {
    return { error: `Unable to verify slug uniqueness: ${conflictError.message}` };
  }
  if (conflicting) {
    return { error: `The slug "${nextSlug}" is already in use.` };
  }

  const { error: updateError } = await supabase
    .from('articles')
    .update({
      title,
      slug: nextSlug,
      excerpt,
      category,
      tags,
      hero_image: heroImage,
      interactive_slug: interactiveSlug,
      interactive_html,
      status,
      published_at: publishedAt,
      body_mdx: body
    })
    .eq('id', articleId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Update pillar relationships
  await supabase.from('article_pillars').delete().eq('article_id', articleId);

  if (pillars.length > 0) {
    const { data: pillarRows, error: pillarError } = await supabase.from('pillars').select('id, slug');
    if (pillarError) {
      return { error: pillarError.message };
    }

    const slugToId = new Map<string, string>();
    (pillarRows ?? []).forEach((row) => {
      slugToId.set(row.slug, row.id);
    });

    const rows = pillars
      .map((slug) => slugToId.get(slug))
      .filter((pillarId): pillarId is string => Boolean(pillarId))
      .map((pillarId) => ({
        article_id: articleId,
        pillar_id: pillarId
      }));

    if (rows.length > 0) {
      const { error: pivotError } = await supabase.from('article_pillars').insert(rows);
      if (pivotError) {
        return { error: pivotError.message };
      }
    }
  }

  revalidatePath('/blog');
  revalidatePath(`/blog/${nextSlug}`);
  if (originalSlug && originalSlug !== nextSlug) {
    revalidatePath(`/blog/${originalSlug}`);
  }
  revalidatePath('/admin/articles');

  return { success: 'Article updated successfully.' };
}

export async function setArticleListingVisibility(input: { id: string; isListed: boolean }) {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    throw new Error('Only administrators can update article visibility.');
  }

  const id = input.id?.trim();
  if (!id) {
    throw new Error('Missing article identifier.');
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('articles')
    .update({ is_listed: input.isListed })
    .eq('id', id)
    .select('slug')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Article not found.');
  }

  revalidatePath('/blog');
  if (data.slug) {
    revalidatePath(`/blog/${data.slug}`);
  }
  revalidatePath('/');
}
