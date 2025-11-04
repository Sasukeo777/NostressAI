'use server';

import { getSupabaseServiceClient } from '@/lib/supabaseClient';

export interface NewsletterActionState {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const initialNewsletterState: NewsletterActionState = {};

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function subscribeToNewsletter(_: NewsletterActionState, formData: FormData): Promise<NewsletterActionState> {
  const email = String(formData.get('email') ?? '').trim();
  const consentChecked = String(formData.get('consent') ?? '') === 'on';
  const sourcePath = String(formData.get('source') ?? '').slice(0, 255) || null;

  const fieldErrors: Record<string, string> = {};
  if (!email || !validateEmail(email)) fieldErrors.email = 'Enter a valid email.';
  if (!consentChecked) fieldErrors.consent = 'We need your consent to send emails.';

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = getSupabaseServiceClient();

  const { error } = await supabase
    .from('newsletter_signups')
    .upsert(
      {
        email,
        consent: true,
        consent_at: new Date().toISOString(),
        status: 'pending',
        source_path: sourcePath
      },
      { onConflict: 'email' }
    );

  if (error) {
    console.error('[newsletter] upsert error', error);
    return { error: 'Unable to subscribe at the moment. Please try later.' };
  }

  return { success: 'Thanks for subscribing! A confirmation email will arrive soon.' };
}

export { initialNewsletterState };
