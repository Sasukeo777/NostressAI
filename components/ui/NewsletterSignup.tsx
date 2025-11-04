"use client";

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { initialNewsletterState, subscribeToNewsletter, type NewsletterActionState } from '@/app/actions/newsletter';

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  let label = 'Subscribe';
  if (pending) label = '…';
  if (disabled) label = 'Subscribed ✓';
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-medium text-white shadow-[0_18px_32px_-24px_rgba(79,122,117,0.8)] transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-500 dark:hover:bg-primary-400"
    >
      {label}
    </button>
  );
}

export function NewsletterSignup({ source = 'newsletter_component' }: { source?: string }) {
  const [state, formAction] = useFormState<NewsletterActionState, FormData>(subscribeToNewsletter, initialNewsletterState);

  return (
    <div className="relative">
      <h3 className="font-serif text-2xl font-semibold tracking-tight text-neutral-700 dark:text-neutral-50 mb-3">Stay in the loop — calmly</h3>
      <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-xl mb-6">
        A micro-letter (1–2 emails / month). Applied research distillations, tested protocols, tool iterations — zero fluff.
      </p>

      {state?.error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600 dark:border-red-700/60 dark:bg-red-500/10 dark:text-red-200">
          {state.error}
        </div>
      ) : null}
      {state?.success ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-500/10 dark:text-emerald-200">
          {state.success}
        </div>
      ) : null}

      <form action={formAction} className="flex max-w-lg flex-col gap-3" noValidate>
        <input type="hidden" name="source" value={source} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            name="email"
            required
            placeholder="Your email"
            className="flex-1 rounded-full border border-neutral-200 bg-white/90 px-5 py-2.5 text-sm text-neutral-600 shadow-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100 dark:focus:border-primary-700 dark:focus:ring-primary-800/40"
            aria-invalid={Boolean(state?.fieldErrors?.email)}
            aria-describedby={state?.fieldErrors?.email ? 'newsletter-email-error' : undefined}
            disabled={Boolean(state?.success)}
          />
          <SubmitButton disabled={Boolean(state?.success)} />
        </div>
        {state?.fieldErrors?.email && <p id="newsletter-email-error" className="text-xs text-red-500">{state.fieldErrors.email}</p>}

        <label className="flex items-start gap-3 rounded-lg border border-neutral-200/70 px-3 py-2 text-[12px] text-neutral-600 transition hover:border-primary-200 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-primary-500/40">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900"
            aria-invalid={Boolean(state?.fieldErrors?.consent)}
          />
          <span>
            I agree to receive the NoStress AI newsletter and understand I can unsubscribe at any time. Learn more in the{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </span>
        </label>
        {state?.fieldErrors?.consent && <p className="text-xs text-red-500">{state.fieldErrors.consent}</p>}
      </form>

      <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">No tracking · instant unsubscribe</p>
    </div>
  );
}
