'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';

import type { AdminResourceSummary, HolisticPillar } from '@/lib/types';
import { HOLISTIC_PILLARS } from '@/lib/pillars';
import { formatDateLabel } from '@/lib/utils/formatDate';

interface ResourceManagerTableProps {
  resources: AdminResourceSummary[];
  onToggle: (input: { id: string; isListed: boolean }) => Promise<void>;
}

export function ResourceManagerTable({ resources, onToggle }: ResourceManagerTableProps) {
  const [items, setItems] = useState(resources);
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<AdminResourceSummary['type']>>(new Set());
  const [selectedPillars, setSelectedPillars] = useState<Set<HolisticPillar>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setItems(resources);
  }, [resources]);

  const normalisedQuery = query.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    return items.filter((resource) => {
      const matchesQuery =
        !normalisedQuery ||
        resource.title.toLowerCase().includes(normalisedQuery) ||
        resource.slug.toLowerCase().includes(normalisedQuery);

      const matchesType =
        selectedTypes.size === 0 || selectedTypes.has(resource.type);

      const matchesPillars =
        selectedPillars.size === 0 ||
        (resource.pillars ?? []).some((pillar) => selectedPillars.has(pillar));

      return matchesQuery && matchesType && matchesPillars;
    });
  }, [items, normalisedQuery, selectedTypes, selectedPillars]);

  const toggleType = (type: AdminResourceSummary['type']) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const togglePillar = (pillar: HolisticPillar) => {
    setSelectedPillars((prev) => {
      const next = new Set(prev);
      if (next.has(pillar)) {
        next.delete(pillar);
      } else {
        next.add(pillar);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedTypes(new Set());
    setSelectedPillars(new Set());
  };

  const handleToggleVisibility = (resource: AdminResourceSummary) => {
    const next = !resource.isListed;
    setPendingId(resource.id);
    setError(null);

    setItems((prev) =>
      prev.map((item) => (item.id === resource.id ? { ...item, isListed: next } : item))
    );

    startTransition(async () => {
      try {
        await onToggle({ id: resource.id, isListed: next });
      } catch (err) {
        console.error(err);
        setItems((prev) =>
          prev.map((item) => (item.id === resource.id ? { ...item, isListed: !next } : item))
        );
        setError('Unable to update resource visibility. Please try again.');
      } finally {
        setPendingId(null);
      }
    });
  };

  const resourceTypes = useMemo(() => {
    const types = new Set<AdminResourceSummary['type']>();
    items.forEach((item) => types.add(item.type));
    return Array.from(types).sort();
  }, [items]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/40 bg-white/80 p-6 shadow-xl ring-1 ring-emerald-500/10 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/70 dark:ring-white/5 md:flex-row md:items-end md:justify-between">
        <div className="flex-1 space-y-3">
          <div>
            <label htmlFor="resource-search" className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              Search by name or slug
            </label>
            <input
              id="resource-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Start typing to filter…"
              className="mt-2 w-full rounded-xl border border-neutral-200/70 bg-white/90 px-3 py-2 text-sm shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:text-neutral-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Filter by type</p>
            <div className="flex flex-wrap gap-2">
              {resourceTypes.map((type) => {
                const isSelected = selectedTypes.has(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                        : 'bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Filter by pillar</p>
            <div className="flex flex-wrap gap-2">
              {HOLISTIC_PILLARS.map((pillar) => {
                const isSelected = selectedPillars.has(pillar.id);
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => togglePillar(pillar.id)}
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                        : 'bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {pillar.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/60 dark:text-neutral-400">
            {filteredItems.length} shown
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border border-neutral-200/70 px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-neutral-100 dark:border-neutral-700/60 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Clear filters
          </button>
        </div>
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
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Pillars</th>
              <th className="px-4 py-3 font-semibold">Published</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900/80">
            {filteredItems.map((resource) => {
              const isHidden = !resource.isListed;
              const isRowPending = pendingId === resource.id && isPending;

              return (
                <tr key={resource.id} className="text-neutral-700 dark:text-neutral-300">
                  <td className="px-4 py-4">
                    <div className="font-medium text-neutral-900 dark:text-neutral-50">{resource.title}</div>
                    <div className="text-xs text-neutral-400 dark:text-neutral-500">/{resource.slug}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                      {resource.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                      {resource.status ?? 'draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {resource.pillars && resource.pillars.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        {resource.pillars.map((pillar) => (
                          <span key={pillar} className="rounded-full bg-neutral-100 px-2 py-0.5 dark:bg-neutral-900">
                            {pillar}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 dark:text-neutral-500">None</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-neutral-500 dark:text-neutral-400">
                    {resource.publishedAt ? formatDateLabel(resource.publishedAt) : '—'}
                  </td>
                  <td className="px-4 py-4">
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
                        onClick={() => handleToggleVisibility(resource)}
                        disabled={isRowPending}
                        className="inline-flex items-center rounded-full border border-neutral-200/70 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700/60 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      >
                        {isRowPending ? 'Updating…' : isHidden ? 'Show' : 'Hide'}
                      </button>
                      <Link
                        href={`/admin/resources/${resource.slug}`}
                        className="inline-flex items-center rounded-full border border-neutral-200/70 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-neutral-100 dark:border-neutral-700/60 dark:text-neutral-200 dark:hover:bg-neutral-800"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No resources match the current filters. Try a different search term or combination.
        </p>
      )}
    </section>
  );
}
