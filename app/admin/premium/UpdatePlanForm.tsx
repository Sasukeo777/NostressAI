'use client';

import { useState, useTransition } from 'react';
import { updateMemberPlan } from './actions';

const PLAN_OPTIONS = [
  { value: 'free', label: 'Free' },
  { value: 'plus', label: 'NoStress+' },
  { value: 'newsletter', label: 'Newsletter only' }
];

export function UpdatePlanForm({ userId, initialPlan }: { userId: string; initialPlan: string }) {
  const [plan, setPlan] = useState(initialPlan);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          setError(null);
          setSuccess(null);
          try {
            await updateMemberPlan(userId, plan);
            setSuccess('Saved');
            setTimeout(() => setSuccess(null), 3000);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to update plan.');
          }
        });
      }}
    >
      <select
        value={plan}
        onChange={(event) => setPlan(event.target.value)}
        className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-neutral-600 focus:border-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-200 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200 dark:focus:border-primary-500"
        disabled={isPending}
      >
        {PLAN_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:-translate-y-[1px] hover:border-primary-300 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200"
      >
        {isPending ? 'Saving…' : 'Update'}
      </button>
      {success && <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-500">{success}</span>}
      {error && <span className="text-[10px] uppercase tracking-[0.3em] text-red-500">{error}</span>}
    </form>
  );
}
