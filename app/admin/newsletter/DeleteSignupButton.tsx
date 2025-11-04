'use client';

import { useState, useTransition } from 'react';

import { deleteNewsletterSignup } from './actions';

interface DeleteSignupButtonProps {
  id: string;
  email: string;
}

export function DeleteSignupButton({ id, email }: DeleteSignupButtonProps) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1 text-xs">
      <button
        type="button"
        className="rounded-full border border-red-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-600 transition hover:-translate-y-[1px] hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(`Delete the newsletter signup for ${email}?`)) {
            return;
          }
          setFeedback(null);
          startTransition(async () => {
            try {
              await deleteNewsletterSignup(id);
              setFeedback('Deleted');
            } catch (error) {
              setFeedback(error instanceof Error ? error.message : 'Unable to delete signup.');
            }
          });
        }}
      >
        {pending ? 'Deleting…' : 'Delete'}
      </button>
      {feedback ? <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{feedback}</span> : null}
    </div>
  );
}
