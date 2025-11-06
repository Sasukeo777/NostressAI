'use server';

import { addContactToNewsletterAudience } from '@/lib/email/newsletter';
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

export type NewsletterConfirmationStatus = 'missing_token' | 'invalid' | 'already_confirmed' | 'confirmed';

export interface NewsletterConfirmationResult {
  status: NewsletterConfirmationStatus;
  email?: string;
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

export async function confirmNewsletterSubscription(token: string, email?: string): Promise<NewsletterConfirmationResult> {
  if (!token) {
    return { status: 'missing_token' };
  }

  const supabase = getSupabaseServiceClient();

  let builder = supabase
    .from('newsletter_signups')
    .select('id, email, status, source_path')
    .eq('double_opt_in_token', token);

  if (email) {
    builder = builder.ilike('email', email.toLowerCase());
  }

  const { data, error } = await builder.maybeSingle();

  if (error) {
    throw new Error(`Failed to verify newsletter token: ${error.message}`);
  }

  if (!data) {
    return { status: 'invalid' };
  }

  if (data.status === 'confirmed') {
    return { status: 'already_confirmed', email: data.email };
  }

  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from('newsletter_signups')
    .update({
      status: 'confirmed',
      confirmed_at: now,
      double_opt_in_token: null
    })
    .eq('id', data.id);

  if (updateError) {
    throw new Error(`Failed to confirm newsletter signup: ${updateError.message}`);
  }

  try {
    await addContactToNewsletterAudience(data.email);
  } catch (audienceError) {
    console.error('[newsletter] Unable to add confirmed contact to Resend audience', audienceError);
  }

  return { status: 'confirmed', email: data.email };
}
