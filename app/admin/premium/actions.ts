'use server';

import { revalidatePath } from 'next/cache';
import { getAuthContext } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';

const allowedPlans = new Set(['free', 'plus', 'newsletter']);

export async function updateMemberPlan(userId: string, plan: string) {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    throw new Error('Only administrators can update plans.');
  }

  if (!userId || !allowedPlans.has(plan)) {
    throw new Error('Invalid plan update request.');
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from('profiles')
    .update({ plan })
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/premium');
  revalidatePath('/admin');
}
