'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { submitContact, contactInitialState, type ContactActionState } from './actions';

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  let label = 'Send';
  if (pending) label = 'Sending…';
  if (disabled) label = 'Message sent ✓';
  return (
    <Button type="submit" disabled={pending || disabled}>
      {label}
    </Button>
  );
}

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction] = useFormState<ContactActionState, FormData>(submitContact, contactInitialState);

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  useEffect(() => {
    if (!formRef.current) return;
    const userAgentInput = formRef.current.querySelector<HTMLInputElement>('input[name="userAgent"]');
    if (userAgentInput) {
      userAgentInput.value = navigator.userAgent;
    }
  }, []);

  return (
    <div className="space-y-8 max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="text-neutral-600 dark:text-neutral-300">
        Question, collaboration or specific need? Write to me. I usually respond within two business days.
      </p>

      {state?.success ? (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-500/10 dark:text-emerald-200">
          {state.success}
        </div>
      ) : null}
      {state?.error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-600/60 dark:bg-red-500/10 dark:text-red-300">
          {state.error}
        </div>
      ) : null}

      <form ref={formRef} action={formAction} className="space-y-5">
        <input type="hidden" name="origin" value="/contact" />
        <input type="hidden" name="userAgent" value="" />

        <div>
          <label className="block text-xs font-medium mb-1 text-neutral-500 dark:text-neutral-300" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
            aria-invalid={Boolean(state?.fieldErrors?.name)}
            aria-describedby={state?.fieldErrors?.name ? 'name-error' : undefined}
          />
          {state?.fieldErrors?.name && <p id="name-error" className="mt-1 text-xs text-red-500">{state.fieldErrors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-neutral-500 dark:text-neutral-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
            aria-invalid={Boolean(state?.fieldErrors?.email)}
            aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
          />
          {state?.fieldErrors?.email && <p id="email-error" className="mt-1 text-xs text-red-500">{state.fieldErrors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-neutral-500 dark:text-neutral-300" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm"
            aria-invalid={Boolean(state?.fieldErrors?.message)}
            aria-describedby={state?.fieldErrors?.message ? 'message-error' : undefined}
          />
          {state?.fieldErrors?.message && <p id="message-error" className="mt-1 text-xs text-red-500">{state.fieldErrors.message}</p>}
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-neutral-200/70 px-3 py-2 text-xs text-neutral-600 transition hover:border-primary-200 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-primary-500/40">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900"
            aria-invalid={Boolean(state?.fieldErrors?.consent)}
          />
          <span>
            I consent to NoStress AI processing my details to respond to this request. Learn more in the{' '}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {state?.fieldErrors?.consent && <p className="text-xs text-red-500">{state.fieldErrors.consent}</p>}

        <SubmitButton disabled={Boolean(state?.success)} />
      </form>
    </div>
  );
}
