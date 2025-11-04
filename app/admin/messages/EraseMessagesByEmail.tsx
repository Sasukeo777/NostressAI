'use client';

import { FormEvent, useState, useTransition } from 'react';

import { deleteContactMessagesByEmail } from './actions';

export function EraseMessagesByEmail({ initialEmail = '' }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus({ type: 'error', message: 'Enter an email address.' });
      return;
    }
    if (
      !window.confirm(
        `Delete all contact messages associated with "${trimmed}"? This fulfils a right-to-be-forgotten request and cannot be undone.`
      )
    ) {
      return;
    }
    setStatus(null);
    startTransition(async () => {
      try {
        await deleteContactMessagesByEmail(trimmed);
        setStatus({ type: 'success', message: 'All messages erased.' });
        setEmail('');
      } catch (error) {
        setStatus({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unable to delete messages.'
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-2xl border border-neutral-200/70 p-4 dark:border-neutral-800/70">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
          Data deletion (contact)
        </label>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Provide the requester&apos;s email to remove all stored contact messages.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="user@example.com"
          className="flex-1 rounded-full border border-neutral-200 bg-white/90 px-4 py-2 text-sm text-neutral-600 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-100 dark:focus:border-primary-600 dark:focus:ring-primary-700/30"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-[1px] hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-400"
        >
          {pending ? 'Processing…' : 'Erase'}
        </button>
      </div>
      {status ? (
        <p
          className={`text-xs ${
            status.type === 'success' ? 'text-emerald-500 dark:text-emerald-300' : 'text-red-500 dark:text-red-300'
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
