'use server';

import { randomUUID } from 'crypto';

import { sendNewsletterDoubleOptInEmail } from '@/lib/email/newsletter';
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
  const normalisedEmail = email.toLowerCase();

  const fieldErrors: Record<string, string> = {};
  if (!email || !validateEmail(email)) fieldErrors.email = 'Enter a valid email.';
  if (!consentChecked) fieldErrors.consent = 'We need your consent to send emails.';

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = getSupabaseServiceClient();

  const { data: existingSignup, error: lookupError } = await supabase
    .from('newsletter_signups')
    .select('id, status, confirmed_at')
    .eq('email', normalisedEmail)
    .maybeSingle();

  if (lookupError) {
    console.error('[newsletter] lookup error', lookupError);
    return { error: 'Unable to subscribe at the moment. Please try later.' };
  }

  if (existingSignup && existingSignup.status === 'confirmed') {
    return { success: 'You are already confirmed. The next note will land calmly in your inbox.' };
  }

  const token = randomUUID();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('newsletter_signups')
    .upsert(
      {
        email: normalisedEmail,
        consent: true,
        consent_at: new Date().toISOString(),
        status: 'pending',
        source_path: sourcePath,
        double_opt_in_token: token,
        double_opt_in_sent_at: null,
        confirmed_at: null
      },
      { onConflict: 'email' }
    );

  if (error) {
    console.error('[newsletter] upsert error', error);
    return { error: 'Unable to subscribe at the moment. Please try later.' };
  }

  const localFallback = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : localFallback);

  if (!baseUrl) {
    console.error('[newsletter] Missing NEXT_PUBLIC_SITE_URL or fallback when building confirmation link');
    return { error: 'Unable to complete the subscription. Please try again soon.' };
  }

  const confirmUrl = new URL('/newsletter/confirm', baseUrl);
  confirmUrl.searchParams.set('token', token);
  confirmUrl.searchParams.set('email', email);

  try {
    await sendNewsletterDoubleOptInEmail({ email, confirmUrl: confirmUrl.toString(), sourcePath });
  } catch (sendError) {
    console.error('[newsletter] Failed to send confirmation email via Resend', sendError);
    return { error: 'We could not send the confirmation email. Please try again later.' };
  }

  const { error: timestampError } = await supabase
    .from('newsletter_signups')
    .update({ double_opt_in_sent_at: now })
    .eq('email', normalisedEmail);

  if (timestampError) {
    console.error('[newsletter] Failed to update double opt-in timestamp', timestampError);
  }

  return { success: 'Almost there! Please confirm via the email we just sent you.' };
}

export { initialNewsletterState };
