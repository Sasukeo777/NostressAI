'use server';

import type { ResourceMeta, HolisticPillar } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

interface ResourceRow {
  id: string;
  slug: string;
  type: string;
  title: string;
  excerpt: string | null;
  tags: string[] | null;
  published_at: string | null;
  status: string | null;
  is_listed?: boolean | null;
}

export async function getAllResources(): Promise<ResourceMeta[]> {
  // Skip DB fetch during build to prevent crashes
  if (process.env.npm_lifecycle_event === 'build') {
    return [];
  }
  noStore();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const [resourceResult, pivotResult, pillarResult] = await Promise.all([
      supabase
        .from('resources')
        .select('id, slug, type, title, excerpt, tags, published_at, status, is_listed')
        .order('published_at', { ascending: false }),
      supabase.from('resource_pillars').select('resource_id, pillar_id'),
      supabase.from('pillars').select('id, slug')
    ]);

    if (resourceResult.error) throw new Error(resourceResult.error.message);
    if (pivotResult.error) throw new Error(pivotResult.error.message);
    if (pillarResult.error) throw new Error(pillarResult.error.message);

    const rows = (resourceResult.data ?? []).filter(
      (row) => row.status === 'published' && row.is_listed !== false
    );
    const pivotRows = pivotResult.data ?? [];
    const pillarRows = pillarResult.data ?? [];

    const pillarMap = new Map<string, string>();
    pillarRows.forEach((row) => {
      pillarMap.set(row.id, row.slug);
    });

    const resourcePillars = new Map<string, HolisticPillar[]>();
    pivotRows.forEach((pivot) => {
      const slug = pillarMap.get(pivot.pillar_id);
      if (!slug) return;
      const list = resourcePillars.get(pivot.resource_id) ?? [];
      list.push(slug as HolisticPillar);
      resourcePillars.set(pivot.resource_id, list);
    });

    return rows.map((row) => mapResourceRow(row, resourcePillars.get(row.id)));
  } catch (error) {
    console.error('[resources] Failed to load resources (handled):', error);
    return [];
  }
}

function mapResourceRow(row: ResourceRow, pillars?: HolisticPillar[]): ResourceMeta {
  const publishedAt = row.published_at ? new Date(row.published_at).toISOString() : new Date().toISOString();
  return {
    slug: row.slug,
    title: row.title,
    type: row.type as ResourceMeta['type'],
    tags: row.tags ?? [],
    date: publishedAt,
    excerpt: row.excerpt ?? undefined,
    pillars: pillars?.length ? pillars : undefined
  };
}
