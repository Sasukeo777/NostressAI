'use server';

import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import type { Formation, AdminFormationSummary } from '@/lib/types';

interface FormationRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  availability: string | null;
  level: string | null;
  modules: unknown;
  status?: string | null;
  external_url?: string | null;
  is_listed?: boolean | null;
}

export async function listFormations(): Promise<Formation[]> {
  const supabase = getSupabaseServiceClient();

  const [formationRows, pivotResult, pillarResult] = await Promise.all([
    fetchFormationRows(supabase),
    supabase.from('formation_pillars').select('formation_id, pillar_id'),
    supabase.from('pillars').select('id, slug')
  ]);

  if (pivotResult.error) {
    throw new Error(`Failed to load formation pillars: ${pivotResult.error.message}`);
  }
  if (pillarResult.error) {
    throw new Error(`Failed to load pillars: ${pillarResult.error.message}`);
  }

  const formationsData = formationRows ?? [];
  const pivotRows = pivotResult.data ?? [];
  const pillarRows = pillarResult.data ?? [];

  const visibleFormations = formationsData.filter((row) => row.is_listed !== false);

  const pillarMap = new Map<string, string>();
  pillarRows.forEach((pillar) => {
    pillarMap.set(pillar.id, pillar.slug);
  });

  const formationPillars = new Map<string, string[]>();
  pivotRows.forEach((pivot) => {
    const slug = pillarMap.get(pivot.pillar_id);
    if (!slug) return;
    const list = formationPillars.get(pivot.formation_id) ?? [];
    list.push(slug);
    formationPillars.set(pivot.formation_id, list);
  });

  return visibleFormations.map((row) => mapFormationRow(row, formationPillars.get(row.id)));
}

export async function listFormationsForAdmin(): Promise<AdminFormationSummary[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('formations')
    .select('id, title, slug, status, is_listed')
    .order('title', { ascending: true });

  if (error) {
    throw new Error(`Failed to load formations: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: (row.status as AdminFormationSummary['status']) ?? 'soon',
    isListed: row.is_listed !== false
  }));
}

export async function getFormationBySlug(slug: string): Promise<Formation | null> {
  const supabase = getSupabaseServiceClient();

  const formationRow = await fetchFormationRowBySlug(supabase, slug);
  if (!formationRow || formationRow.is_listed === false) return null;

  const [{ data: pivotRows, error: pivotError }, { data: pillarRows, error: pillarError }] = await Promise.all([
    supabase
      .from('formation_pillars')
      .select('pillar_id')
      .eq('formation_id', formationRow.id),
    supabase
      .from('pillars')
      .select('id, slug')
  ]);

  if (pivotError) {
    throw new Error(`Failed to load formation pillars: ${pivotError.message}`);
  }
  if (pillarError) {
    throw new Error(`Failed to load pillars: ${pillarError.message}`);
  }

  const pillarSet = new Set((pivotRows ?? []).map((pivot) => pivot.pillar_id));
  const pillarSlugs = pillarRows?.filter((row) => pillarSet.has(row.id)).map((row) => row.slug) ?? [];

  return mapFormationRow(formationRow, pillarSlugs);
}

function mapFormationRow(row: FormationRow, pillarSlugs?: string[]): Formation {
  const availability = (row.availability as Formation['status'] | undefined) ?? 'available';
  const status: Formation['status'] =
    availability === 'available' || availability === 'prelaunch' || availability === 'soon'
      ? availability
      : 'available';

  const modules = Array.isArray(row.modules) ? row.modules.filter((item): item is string => typeof item === 'string') : [];

  return {
    slug: row.slug,
    title: row.title,
    short: row.summary ?? '',
    status,
    level: (row.level as Formation['level']) ?? undefined,
    outline: modules,
    pillars: pillarSlugs as Formation['pillars'],
    ctaUrl: row.external_url ?? null
  };
}

async function fetchFormationRows(supabase: SupabaseClient): Promise<FormationRow[] | null> {
  const { data, error } = await supabase
    .from('formations')
    .select('id, slug, title, summary, availability, level, modules, status, external_url, is_listed')
    .order('title', { ascending: true });

  if (error && missingAvailabilityColumn(error)) {
    const fallback = await supabase
      .from('formations')
      .select('id, slug, title, summary, level, modules, status, external_url, is_listed')
      .order('title', { ascending: true });

    if (fallback.error) {
      throw new Error(`Failed to load formations: ${fallback.error.message}`);
    }

    return (fallback.data ?? []).map((row) => ({
      ...row,
      availability: null,
      is_listed: row.is_listed
    }));
  }

  if (error) {
    throw new Error(`Failed to load formations: ${error.message}`);
  }

  return data;
}

async function fetchFormationRowBySlug(supabase: SupabaseClient, slug: string): Promise<FormationRow | null> {
  const { data, error } = await supabase
    .from('formations')
    .select('id, slug, title, summary, availability, level, modules, status, external_url, is_listed')
    .eq('slug', slug)
    .maybeSingle();

  if (error && missingAvailabilityColumn(error)) {
    const fallback = await supabase
      .from('formations')
      .select('id, slug, title, summary, level, modules, status, external_url, is_listed')
      .eq('slug', slug)
      .maybeSingle();

    if (fallback.error) {
      throw new Error(`Failed to load formation: ${fallback.error.message}`);
    }

    if (!fallback.data) {
      return null;
    }

    return {
      ...fallback.data,
      availability: null,
      is_listed: fallback.data.is_listed
    };
  }

  if (error) {
    throw new Error(`Failed to load formation: ${error.message}`);
  }

  return data;
}

function missingAvailabilityColumn(error: { message: string; details?: string | null }) {
  return /availability/.test(error.message) || /availability/.test(error.details ?? '');
}
