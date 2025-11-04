'use client';

import { useState, useTransition } from 'react';

import { updateNewsletterStatus } from './actions';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'bounced', label: 'Bounced' },
  { value: 'archived', label: 'Archived' }
];

interface UpdateSignupStatusProps {
  id: string;
  status: string | null;
}

export function UpdateSignupStatus({ id, status }: UpdateSignupStatusProps) {
  const [currentStatus, setCurrentStatus] = useState(status ?? 'pending');
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1 text-xs">
      <select
        value={currentStatus}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value;
          setCurrentStatus(next);
          setFeedback(null);
          startTransition(async () => {
            try {
              await updateNewsletterStatus(id, next);
              setFeedback('Saved');
            } catch (error) {
              setFeedback(error instanceof Error ? error.message : 'Unable to update status.');
              setCurrentStatus(status ?? 'pending');
            }
          });
        }}
        className="min-w-[150px] rounded-full border border-neutral-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-600 transition focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-200 dark:focus:border-primary-500 dark:focus:ring-primary-700/40"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {feedback ? <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{feedback}</span> : null}
    </div>
  );
}
