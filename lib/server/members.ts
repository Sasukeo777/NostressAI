'use server';

import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import type { HolisticPillar } from '@/lib/types';

export interface AdminMember {
  userId: string;
  email: string;
  displayName: string | null;
  plan: 'free' | 'plus' | 'newsletter';
  favoritePillars: HolisticPillar[];
  updatedAt: string;
}

async function listAllUsers(supabase: SupabaseClient, page = 1) {
  const emails = new Map<string, string>();
  let nextPage: number | undefined = page;

  while (nextPage) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page: nextPage,
      perPage: 1000
    });
    if (error) {
      throw new Error(`Failed to load auth users: ${error.message}`);
    }
    data.users.forEach((user) => {
      emails.set(user.id, user.email ?? 'unknown');
    });
    nextPage = data.nextPage ?? undefined;
  }

  return emails;
}

export async function listMembers(): Promise<AdminMember[]> {
  const supabase = getSupabaseServiceClient();

  const emailMap = await listAllUsers(supabase);

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, display_name, plan, favorite_pillars, updated_at')
    .order('plan', { ascending: true })
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load profiles: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    userId: row.user_id,
    email: emailMap.get(row.user_id) ?? 'unknown',
    displayName: row.display_name ?? null,
    plan: (row.plan as AdminMember['plan']) ?? 'free',
    favoritePillars: (Array.isArray(row.favorite_pillars) ? row.favorite_pillars : []) as HolisticPillar[],
    updatedAt: row.updated_at ?? ''
  }));
}
