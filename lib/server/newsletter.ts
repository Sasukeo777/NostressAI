'use server';

import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import type { AdminNewsletterSignup } from '@/lib/types';

interface NewsletterSignupRow {
  id: string;
  email: string;
  status: string | null;
  consent: boolean | null;
  consent_at: string | null;
  source_path: string | null;
  double_opt_in_sent_at: string | null;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ListNewsletterOptions {
  search?: string;
  status?: string;
  limit?: number;
}

export async function listNewsletterSignups(options: ListNewsletterOptions = {}): Promise<AdminNewsletterSignup[]> {
  const supabase = getSupabaseServiceClient();
  const { search, status, limit } = options;

  let query = supabase
    .from('newsletter_signups')
    .select(
      'id, email, status, consent, consent_at, source_path, double_opt_in_sent_at, confirmed_at, created_at, updated_at'
    )
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('email', `%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (limit && Number.isFinite(limit)) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load newsletter signups: ${error.message}`);
  }

  return (data ?? []).map((row: NewsletterSignupRow) => ({
    id: row.id,
    email: row.email,
    status: row.status,
    consent: row.consent ?? false,
    consentAt: row.consent_at,
    sourcePath: row.source_path ?? undefined,
    doubleOptInSentAt: row.double_opt_in_sent_at ?? undefined,
    confirmedAt: row.confirmed_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined
  }));
}

export async function countNewsletterSignups(): Promise<number> {
  const supabase = getSupabaseServiceClient();
  const { count, error } = await supabase
    .from('newsletter_signups')
    .select('id', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to count newsletter signups: ${error.message}`);
  }

  return count ?? 0;
}
