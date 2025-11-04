'use server';

import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import type { AdminContactMessage } from '@/lib/types';

interface ContactMessageRow {
  id: string;
  full_name: string;
  email: string;
  message: string;
  consent: boolean | null;
  consent_at: string | null;
  origin_path: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ListContactMessagesOptions {
  search?: string;
  limit?: number;
}

export async function listContactMessages(options: ListContactMessagesOptions = {}): Promise<AdminContactMessage[]> {
  const supabase = getSupabaseServiceClient();
  const { search, limit } = options;

  let query = supabase
    .from('contact_messages')
    .select('id, full_name, email, message, consent, consent_at, origin_path, user_agent, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('email', `%${search}%`);
  }

  if (limit && Number.isFinite(limit)) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load contact messages: ${error.message}`);
  }

  return (data ?? []).map((row: ContactMessageRow) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    message: row.message,
    consent: row.consent ?? false,
    consentAt: row.consent_at,
    originPath: row.origin_path ?? undefined,
    userAgent: row.user_agent ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined
  }));
}

export async function countContactMessages(): Promise<number> {
  const supabase = getSupabaseServiceClient();
  const { count, error } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to count contact messages: ${error.message}`);
  }

  return count ?? 0;
}
