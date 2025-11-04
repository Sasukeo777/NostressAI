'use server';

import { revalidatePath } from 'next/cache';

import { getAuthContext } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';

export async function deleteContactMessage(messageId: string) {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    throw new Error('Only administrators can delete contact messages.');
  }

  const id = messageId?.trim();
  if (!id) {
    throw new Error('Missing contact message identifier.');
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/messages');
  revalidatePath('/admin');
}

export async function deleteContactMessagesByEmail(emailAddress: string) {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    throw new Error('Only administrators can process deletion requests.');
  }

  const email = emailAddress?.trim().toLowerCase();
  if (!email) {
    throw new Error('Provide an email address to process data deletion.');
  }

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from('contact_messages').delete().ilike('email', email);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/messages');
  revalidatePath('/admin');
}
