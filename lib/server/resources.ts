'use server';

import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import type { AdminResourceDetail, AdminResourceSummary, HolisticPillar } from '@/lib/types';

interface ResourceRow {
  id: string;
  slug: string;
  title: string;
  type: string;
  excerpt: string | null;
  tags: string[] | null;
  body_mdx: string | null;
  status: string | null;
  is_listed: boolean | null;
  published_at: string | null;
}

export async function listResourcesForAdmin(): Promise<AdminResourceSummary[]> {
  const supabase = getSupabaseServiceClient();

  const [resourceResult, pivotResult, pillarResult] = await Promise.all([
    supabase
      .from('resources')
      .select('id, slug, title, type, status, is_listed, published_at')
      .order('published_at', { ascending: false })
      .order('title', { ascending: true }),
    supabase.from('resource_pillars').select('resource_id, pillar_id'),
    supabase.from('pillars').select('id, slug')
  ]);

  if (resourceResult.error) {
    throw new Error(`Failed to load resources: ${resourceResult.error.message}`);
  }
  if (pivotResult.error) {
    throw new Error(`Failed to load resource pillars: ${pivotResult.error.message}`);
  }
  if (pillarResult.error) {
    throw new Error(`Failed to load pillars: ${pillarResult.error.message}`);
  }

  const resources = (resourceResult.data ?? []) as ResourceRow[];
  const pivotRows = pivotResult.data ?? [];
  const pillarRows = pillarResult.data ?? [];

  const pillarMap = new Map<string, HolisticPillar>();
  pillarRows.forEach((row) => {
    pillarMap.set(row.id, row.slug as HolisticPillar);
  });

  const resourcePillars = new Map<string, HolisticPillar[]>();
  pivotRows.forEach((pivot) => {
    const slug = pillarMap.get(pivot.pillar_id);
    if (!slug) return;
    const list = resourcePillars.get(pivot.resource_id) ?? [];
    list.push(slug);
    resourcePillars.set(pivot.resource_id, list);
  });

  return resources.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type as AdminResourceSummary['type'],
    isListed: row.is_listed !== false,
    status: (row.status as AdminResourceSummary['status']) ?? null,
    publishedAt: row.published_at,
    pillars: resourcePillars.get(row.id) ?? []
  }));
}

export async function getResourceForEdit(slug: string): Promise<AdminResourceDetail | null> {
  const supabase = getSupabaseServiceClient();

  const { data: resource, error } = await supabase
    .from('resources')
    .select('id, slug, title, type, excerpt, tags, body_mdx, status, is_listed, published_at')
    .eq('slug', slug)
    .maybeSingle<ResourceRow>();

  if (error) {
    throw new Error(`Failed to load resource: ${error.message}`);
  }
  if (!resource || !resource.body_mdx) {
    return null;
  }

  const [{ data: pivotRows, error: pivotError }, { data: pillarRows, error: pillarError }] = await Promise.all([
    supabase.from('resource_pillars').select('pillar_id').eq('resource_id', resource.id),
    supabase.from('pillars').select('id, slug')
  ]);

  if (pivotError) {
    throw new Error(`Failed to load resource pillars: ${pivotError.message}`);
  }
  if (pillarError) {
    throw new Error(`Failed to load pillars: ${pillarError.message}`);
  }

  const pillarSet = new Set((pivotRows ?? []).map((pivot) => pivot.pillar_id));
  const pillars =
    pillarRows?.filter((row) => pillarSet.has(row.id)).map((row) => row.slug as HolisticPillar) ?? [];

  return {
    id: resource.id,
    title: resource.title,
    slug: resource.slug,
    type: resource.type as AdminResourceSummary['type'],
    isListed: resource.is_listed !== false,
    status: (resource.status as AdminResourceSummary['status']) ?? null,
    publishedAt: resource.published_at,
    excerpt: resource.excerpt,
    tags: resource.tags,
    body: resource.body_mdx,
    pillars
  };
}
