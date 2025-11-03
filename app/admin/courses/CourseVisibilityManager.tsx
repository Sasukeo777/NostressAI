'use client';

import { useEffect, useState, useTransition } from 'react';
import type { AdminFormationSummary } from '@/lib/types';

interface CourseVisibilityManagerProps {
  formations: AdminFormationSummary[];
  onToggle: (input: { id: string; isListed: boolean }) => Promise<void>;
}

export function CourseVisibilityManager({ formations, onToggle }: CourseVisibilityManagerProps) {
  const [items, setItems] = useState(formations);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setItems(formations);
  }, [formations]);

  const handleToggle = (formation: AdminFormationSummary) => {
    const next = !formation.isListed;
    setPendingId(formation.id);
    setError(null);
    setItems((prev) =>
      prev.map((item) => (item.id === formation.id ? { ...item, isListed: next } : item))
    );

    startTransition(async () => {
      try {
        await onToggle({ id: formation.id, isListed: next });
      } catch (err) {
        console.error(err);
        setItems((prev) =>
          prev.map((item) => (item.id === formation.id ? { ...item, isListed: !next } : item))
        );
        setError('Unable to update course visibility. Please try again.');
      } finally {
        setPendingId(null);
      }
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Manage course visibility</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Keep drafts private while you iterate. Hidden courses stay editable but won’t appear on the public listing.
        </p>
      </div>
      {error && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}
      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/80 shadow-lg dark:border-neutral-800/60 dark:bg-neutral-950/70">
        <table className="min-w-full divide-y divide-neutral-200 text-sm dark:divide-neutral-800">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900/80">
            {items.map((formation) => {
              const isHidden = !formation.isListed;
              const isRowPending = pendingId === formation.id && isPending;
              return (
                <tr key={formation.id} className="text-neutral-700 dark:text-neutral-300">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900 dark:text-neutral-50">{formation.title}</div>
                    <div className="text-xs text-neutral-400 dark:text-neutral-500">/{formation.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                      {formation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isHidden
                            ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300'
                            : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'
                        }`}
                      >
                        {isHidden ? 'Hidden' : 'Visible'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggle(formation)}
                        disabled={isRowPending}
                        className="inline-flex items-center rounded-full border border-neutral-200/70 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700/60 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      >
                        {isRowPending ? 'Updating…' : isHidden ? 'Show' : 'Hide'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
