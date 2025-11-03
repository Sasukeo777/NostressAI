'use server';

import { revalidatePath } from 'next/cache';

import { getAuthContext } from '@/lib/auth';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import { fetchAboutRecord, getAboutContentWithFallback } from '@/lib/server/about';

export interface AboutActionState {
  success?: string;
  error?: string;
}

export async function getAboutContent() {
  return getAboutContentWithFallback();
}

export async function saveAbout(
  _previousState: AboutActionState,
  formData: FormData
): Promise<AboutActionState> {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    return { error: 'Only administrators can update the About page.' };
  }

  const heading = String(formData.get('heading') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  if (!heading) {
    return { error: 'Heading is required.' };
  }

  if (!body) {
    return { error: 'Body content is required.' };
  }

  const supabase = getSupabaseServiceClient();
  const existing = await fetchAboutRecord();

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from('about_content')
      .update({ heading, body_mdx: body })
      .eq('id', existing.id);

    if (updateError) {
      return { error: updateError.message };
    }
  } else {
    const { error: insertError } = await supabase
      .from('about_content')
      .insert({ heading, body_mdx: body });

    if (insertError) {
      return { error: insertError.message };
    }
  }

  revalidatePath('/about');
  revalidatePath('/admin/about');

  return { success: 'About page updated successfully.' };
}
