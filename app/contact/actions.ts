'use server';

import { getSupabaseServiceClient } from '@/lib/supabaseClient';

export interface ContactActionState {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const initialState: ContactActionState = {};

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitContact(_: ContactActionState, formData: FormData): Promise<ContactActionState> {
  const fullName = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  const consentChecked = String(formData.get('consent') ?? '') === 'on';
  const originPath = String(formData.get('origin') ?? '/contact').slice(0, 255);
  const userAgent = String(formData.get('userAgent') ?? '').slice(0, 255);

  const fieldErrors: Record<string, string> = {};

  if (!fullName) fieldErrors.name = 'Name is required.';
  if (!email || !validateEmail(email)) fieldErrors.email = 'Enter a valid email.';
  if (!message) fieldErrors.message = 'Please add a brief message.';
  if (!consentChecked) fieldErrors.consent = 'Consent is required to process your request.';

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = getSupabaseServiceClient();

  const { error } = await supabase.from('contact_messages').insert({
    full_name: fullName,
    email,
    message,
    consent: consentChecked,
    consent_at: new Date().toISOString(),
    origin_path: originPath,
    user_agent: userAgent || null
  });

  if (error) {
    console.error('[contact] insert error', error);
    return { error: 'Unable to send your message right now. Please try again later.' };
  }

  return { success: 'Thank you. We will reply as soon as possible.' };
}

export { initialState as contactInitialState };
