'use server';

import { revalidatePath } from 'next/cache';

import { getAuthContext } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import { slugify } from '@/lib/utils/slugify';
import type { HolisticPillar, ResourceType } from '@/lib/types';

export interface CreateResourceState {
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

export async function createResource(_: CreateResourceState, formData: FormData): Promise<CreateResourceState> {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    return { error: 'Only administrators can create resources.' };
  }

  const title = String(formData.get('title') ?? '').trim();
  const slugInput = String(formData.get('slug') ?? '').trim();
  const type = String(formData.get('type') ?? '').trim() as ResourceType;
  const body = String(formData.get('body') ?? '').trim();

  const fieldErrors: Record<string, string> = {};

  if (!title) fieldErrors.title = 'Title is required.';
  if (!type || (type !== 'tip' && type !== 'study')) fieldErrors.type = 'Select a valid type.';
  const slug = slugify(slugInput || title);
  if (!slug) fieldErrors.slug = 'Provide a title or slug.';
  if (!body) fieldErrors.body = 'Body content is required.';

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const excerpt = String(formData.get('excerpt') ?? '').trim() || null;
  const publishedAtValue = String(formData.get('publishedAt') ?? '').trim();
  const tags = parseTags(String(formData.get('tags') ?? '').trim() || null);
  const pillars = parsePillars(formData.getAll('pillars').map((value) => String(value)));

  const supabase = getSupabaseServiceClient();

  const { data: existing, error: existingError } = await supabase
    .from('resources')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existingError) {
    return { error: `Unable to verify slug uniqueness: ${existingError.message}` };
  }
  if (existing) {
    return { error: `The slug "${slug}" is already in use.` };
  }

  let publishedAt: string | null = null;
  if (publishedAtValue) {
    const parsed = new Date(publishedAtValue);
    if (!Number.isNaN(parsed.getTime())) {
      publishedAt = parsed.toISOString();
    }
  }

  const { data: inserted, error: insertError } = await supabase
    .from('resources')
    .insert({
      slug,
      title,
      type,
      excerpt,
      tags,
      status: String(formData.get('status') ?? 'draft') === 'published' ? 'published' : 'draft',
      published_at: publishedAt,
      body_mdx: body
    })
    .select('id')
    .maybeSingle();

  if (insertError) {
    return { error: insertError.message };
  }

  if (inserted?.id && pillars.length > 0) {
    const { data: pillarRows, error: pillarError } = await supabase.from('pillars').select('id, slug');
    if (pillarError) {
      return { error: pillarError.message };
    }

    const slugToId = new Map<string, string>();
    (pillarRows ?? []).forEach((row) => slugToId.set(row.slug, row.id));

    const rows = pillars
      .map((pillarSlug) => slugToId.get(pillarSlug))
      .filter((pillarId): pillarId is string => Boolean(pillarId))
      .map((pillarId) => ({
        resource_id: inserted.id,
        pillar_id: pillarId
      }));

    if (rows.length > 0) {
      const { error: pivotError } = await supabase.from('resource_pillars').insert(rows);
      if (pivotError) {
        return { error: pivotError.message };
      }
    }
  }

  revalidatePath('/resources');
  revalidatePath('/admin');
  revalidatePath('/admin/resources');
  revalidatePath(`/resources/${slug}`);

  return { success: 'Resource created successfully.' };
}

export interface UpdateResourceState {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function updateResource(_: UpdateResourceState, formData: FormData): Promise<UpdateResourceState> {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    return { error: 'Only administrators can update resources.' };
  }

  const resourceId = String(formData.get('resourceId') ?? '').trim();
  const originalSlug = String(formData.get('originalSlug') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const slugInput = String(formData.get('slug') ?? '').trim();
  const type = String(formData.get('type') ?? '').trim() as ResourceType;
  const body = String(formData.get('body') ?? '').trim();

  const fieldErrors: Record<string, string> = {};

  if (!resourceId) {
    return { error: 'Missing resource identifier.' };
  }
  if (!title) {
    fieldErrors.title = 'Title is required.';
  }
  if (!type || (type !== 'tip' && type !== 'study')) {
    fieldErrors.type = 'Select a valid type.';
  }
  const nextSlug = slugify(slugInput || title);
  if (!nextSlug) {
    fieldErrors.slug = 'Provide a title or slug.';
  }
  if (!body) {
    fieldErrors.body = 'Body content is required.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const excerpt = String(formData.get('excerpt') ?? '').trim() || null;
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

  const { data: conflicting, error: conflictError } = await supabase
    .from('resources')
    .select('id')
    .eq('slug', nextSlug)
    .neq('id', resourceId)
    .maybeSingle();

  if (conflictError) {
    return { error: `Unable to verify slug uniqueness: ${conflictError.message}` };
  }
  if (conflicting) {
    return { error: `The slug "${nextSlug}" is already in use.` };
  }

  const { error: updateError } = await supabase
    .from('resources')
    .update({
      title,
      slug: nextSlug,
      type,
      excerpt,
      tags,
      status: String(formData.get('status') ?? 'draft') === 'published' ? 'published' : 'draft',
      published_at: publishedAt,
      body_mdx: body
    })
    .eq('id', resourceId);

  if (updateError) {
    return { error: updateError.message };
  }

  await supabase.from('resource_pillars').delete().eq('resource_id', resourceId);

  if (pillars.length > 0) {
    const { data: pillarRows, error: pillarError } = await supabase.from('pillars').select('id, slug');
    if (pillarError) {
      return { error: pillarError.message };
    }

    const slugToId = new Map<string, string>();
    (pillarRows ?? []).forEach((row) => slugToId.set(row.slug, row.id));

    const rows = pillars
      .map((pillarSlug) => slugToId.get(pillarSlug))
      .filter((pillarId): pillarId is string => Boolean(pillarId))
      .map((pillarId) => ({
        resource_id: resourceId,
        pillar_id: pillarId
      }));

    if (rows.length > 0) {
      const { error: pivotError } = await supabase.from('resource_pillars').insert(rows);
      if (pivotError) {
        return { error: pivotError.message };
      }
    }
  }

  revalidatePath('/resources');
  revalidatePath(`/resources/${nextSlug}`);
  if (originalSlug && originalSlug !== nextSlug) {
    revalidatePath(`/resources/${originalSlug}`);
  }
  revalidatePath('/admin/resources');

  return { success: 'Resource updated successfully.' };
}

export async function setResourceListingVisibility(input: { id: string; isListed: boolean }) {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    throw new Error('Only administrators can update resource visibility.');
  }

  const id = input.id?.trim();
  if (!id) {
    throw new Error('Missing resource identifier.');
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('resources')
    .update({ is_listed: input.isListed })
    .eq('id', id)
    .select('slug')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Resource not found.');
  }

  revalidatePath('/resources');
  if (data.slug) {
    revalidatePath(`/resources/${data.slug}`);
  }
  revalidatePath('/admin/resources');
}
