import Link from 'next/link';
import type { Metadata } from 'next';

import { confirmNewsletterSubscription } from '@/lib/server/newsletter';

interface ConfirmPageProps {
  searchParams?: {
    token?: string;
    email?: string;
  };
}

export const metadata: Metadata = {
  title: 'Confirm newsletter subscription | NoStress AI',
  description: 'Confirm your email address to start receiving calm, actionable updates from NoStress AI.'
};

function renderMessage(status: string, email?: string) {
  switch (status) {
    case 'confirmed':
      return {
        title: 'Subscription confirmed',
        body: `Thanks! ${email ?? 'Your email'} is now on the NoStress AI micro-letter list.`,
        tone: 'success'
      };
    case 'already_confirmed':
      return {
        title: 'Already confirmed',
        body: `${email ?? 'This email'} is already subscribed. Expect 1–2 calm updates per month.`,
        tone: 'info'
      };
    case 'missing_token':
      return {
        title: 'Link incomplete',
        body: 'The confirmation link is missing critical information. Please click the latest email we sent you.',
        tone: 'error'
      };
    case 'invalid':
    case 'error':
    default:
      return {
        title: 'Link expired or invalid',
        body: 'The confirmation link has expired, was already used, or could not be processed. Request a new one by signing up again.',
        tone: 'error'
      };
  }
}

export default async function NewsletterConfirmPage({ searchParams }: ConfirmPageProps) {
  const token = searchParams?.token ?? '';
  const email = searchParams?.email;

  let status: string = 'invalid';
  let confirmedEmail: string | undefined;

  try {
    const result = await confirmNewsletterSubscription(token, email);
    status = result.status;
    confirmedEmail = result.email ?? email;
  } catch (error) {
    console.error('[newsletter] Confirmation error', error);
    status = 'error';
  }

  const message = renderMessage(status, confirmedEmail);
  const panelClass =
    message.tone === 'success'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100'
      : message.tone === 'info'
        ? 'border-primary-500/30 bg-primary-500/10 text-primary-900 dark:text-primary-100'
        : 'border-red-500/30 bg-red-500/10 text-red-900 dark:text-red-100';

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className={`mb-8 w-full rounded-2xl border px-6 py-8 shadow-sm ${panelClass}`}>
        <h1 className="mb-3 text-2xl font-semibold tracking-tight">{message.title}</h1>
        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">{message.body}</p>
      </div>
      <div className="flex gap-4 text-sm text-neutral-500 dark:text-neutral-300">
        <Link href="/" className="underline">
          Back to homepage
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/privacy" className="underline">
          Read privacy policy
        </Link>
      </div>
    </div>
  );
}
