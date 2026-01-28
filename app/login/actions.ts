'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerActionClient } from '@/lib/supabase/auth';

interface AuthResult {
  error?: string;
}

export async function login(_: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = await createSupabaseServerActionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unable to fetch user session.' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();
    return { error: 'Unable to verify profile.' };
  }

  if (!profile || profile.role !== 'admin') {
    revalidatePath('/profile');
    revalidatePath('/');
    redirect('/');
  }

  revalidatePath('/admin');
  redirect('/admin');
}

export async function logout() {
  const supabase = await createSupabaseServerActionClient();
  await supabase.auth.signOut();
  revalidatePath('/profile');
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true } as const;
}

export async function logoutAndRedirect() {
  await logout();
  redirect('/');
}
