'use server';

import { revalidatePath } from 'next/cache';

import { getAuthContext } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';

const allowedStatuses = new Set(['pending', 'confirmed', 'unsubscribed', 'archived', 'bounced']);

function ensureAdmin(role: string | null) {
  if (role !== 'admin') {
    throw new Error('Only administrators can manage newsletter signups.');
  }
}

export async function updateNewsletterStatus(signupId: string, nextStatus: string) {
  const { role } = await getAuthContext();
  ensureAdmin(role);

  const id = signupId?.trim();
  if (!id) {
    throw new Error('Missing newsletter signup identifier.');
  }

  const status = nextStatus?.trim().toLowerCase();
  if (!allowedStatuses.has(status)) {
    throw new Error('Invalid status value.');
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from('newsletter_signups')
    .update({ status })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/newsletter');
  revalidatePath('/admin');
}

export async function deleteNewsletterSignup(signupId: string) {
  const { role } = await getAuthContext();
  ensureAdmin(role);

  const id = signupId?.trim();
  if (!id) {
    throw new Error('Missing newsletter signup identifier.');
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from('newsletter_signups').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/newsletter');
  revalidatePath('/admin');
}

export async function deleteNewsletterSignupsByEmail(emailAddress: string) {
  const { role } = await getAuthContext();
  ensureAdmin(role);

  const email = emailAddress?.trim().toLowerCase();
  if (!email) {
    throw new Error('Provide an email address to process data deletion.');
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from('newsletter_signups').delete().ilike('email', email);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/newsletter');
  revalidatePath('/admin');
}
