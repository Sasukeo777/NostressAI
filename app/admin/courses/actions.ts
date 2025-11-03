'use server';

import { revalidatePath } from 'next/cache';

import { getAuthContext } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import { slugify } from '@/lib/utils/slugify';
import type { HolisticPillar } from '@/lib/types';

export interface CreateCourseState {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseModules(value: string): string[] | undefined {
  const items = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
}

function parsePillars(values: string[]): HolisticPillar[] {
  const set = new Set<HolisticPillar>();
  values.forEach((value) => {
    if (value) set.add(value as HolisticPillar);
  });
  return Array.from(set);
}

export async function createCourse(_: CreateCourseState, formData: FormData): Promise<CreateCourseState> {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    return { error: 'Only administrators can create courses.' };
  }

  const title = String(formData.get('title') ?? '').trim();
  const slugInput = String(formData.get('slug') ?? '').trim();
  const summary = String(formData.get('summary') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const modulesRaw = String(formData.get('modules') ?? '').trim();
  const ctaUrl = String(formData.get('ctaUrl') ?? '').trim() || null;
  const duration = String(formData.get('duration') ?? '').trim() || null;
  const level = String(formData.get('level') ?? '').trim() || null;
  const priceValue = String(formData.get('price') ?? '').trim();
  const statusInput = String(formData.get('status') ?? 'soon');

  const fieldErrors: Record<string, string> = {};

  if (!title) fieldErrors.title = 'Title is required.';
  const slug = slugify(slugInput || title);
  if (!slug) fieldErrors.slug = 'Provide a title or slug.';
  if (!summary) fieldErrors.summary = 'Summary is required.';
  if (!description) fieldErrors.description = 'Description is required.';

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const modules = parseModules(modulesRaw) ?? [];
  const pillars = parsePillars(formData.getAll('pillars').map((value) => String(value)));

  let price: number | null = null;
  if (priceValue) {
    const parsed = Number.parseFloat(priceValue);
    if (Number.isNaN(parsed)) {
      fieldErrors.price = 'Invalid price.';
      return { fieldErrors };
    }
    price = parsed;
  }

  const status = statusInput === 'available' || statusInput === 'prelaunch' ? statusInput : 'soon';

  const supabase = getSupabaseServiceClient();

  const { data: existing, error: existingError } = await supabase
    .from('formations')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existingError) {
    return { error: `Unable to verify slug uniqueness: ${existingError.message}` };
  }
  if (existing) {
    return { error: `The slug "${slug}" is already in use.` };
  }

  const { data: inserted, error: insertError } = await supabase
    .from('formations')
    .insert({
      slug,
      title,
      summary,
      description_mdx: description,
      level: level || null,
      duration,
      price,
      modules,
      status,
      external_url: ctaUrl
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
    (pillarRows ?? []).forEach((row) => {
      slugToId.set(row.slug, row.id);
    });

    const rows = pillars
      .map((pillarSlug) => slugToId.get(pillarSlug))
      .filter((pillarId): pillarId is string => Boolean(pillarId))
      .map((pillarId) => ({
        formation_id: inserted.id,
        pillar_id: pillarId
      }));

    if (rows.length > 0) {
      const { error: pivotError } = await supabase.from('formation_pillars').insert(rows);
      if (pivotError) {
        return { error: pivotError.message };
      }
    }
  }

  revalidatePath('/courses');
  revalidatePath('/admin');
  revalidatePath(`/courses/${slug}`);

  return { success: 'Course created successfully.' };
}

export async function setFormationListingVisibility(input: { id: string; isListed: boolean }) {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    throw new Error('Only administrators can update course visibility.');
  }

  const id = input.id?.trim();
  if (!id) {
    throw new Error('Missing course identifier.');
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('formations')
    .update({ is_listed: input.isListed })
    .eq('id', id)
    .select('slug')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Course not found.');
  }

  revalidatePath('/courses');
  if (data.slug) {
    revalidatePath(`/courses/${data.slug}`);
  }
  revalidatePath('/');
}
