import Link from 'next/link';
import type { Metadata } from 'next';

import { listNewsletterSignups } from '@/lib/server/newsletter';
import { UpdateSignupStatus } from './UpdateSignupStatus';
import { DeleteSignupButton } from './DeleteSignupButton';
import { EraseNewsletterByEmail } from './EraseNewsletterByEmail';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Newsletter signups | Admin',
  description: 'Audit newsletter consent records, manage statuses, and fulfil deletion requests.'
};

function formatTimestamp(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return `${date.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

const statusFilters = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'bounced', label: 'Bounced' },
  { value: 'archived', label: 'Archived' }
];

interface NewsletterPageProps {
  searchParams?: { search?: string; status?: string };
}

export default async function NewsletterAdminPage({ searchParams }: NewsletterPageProps) {
  const search = typeof searchParams?.search === 'string' ? searchParams.search.trim() : '';
  const statusFilter = typeof searchParams?.status === 'string' ? searchParams.status.trim() : '';

  const signups = await listNewsletterSignups({
    search: search || undefined,
    status: statusFilter || undefined,
    limit: 300
  });

  const exportHref =
    '/admin/newsletter/export' +
    (search || statusFilter
      ? `?${[
        search ? `search=${encodeURIComponent(search)}` : null,
        statusFilter ? `status=${encodeURIComponent(statusFilter)}` : null
      ]
        .filter(Boolean)
        .join('&')}`
      : '');

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 rounded-3xl border border-white/50 bg-white/80 p-8 shadow-lg ring-1 ring-primary-500/10 dark:border-neutral-800/70 dark:bg-neutral-950/70 dark:ring-white/5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
            Mailing list
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Newsletter signups</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Verify consent trails, monitor double opt-in status, and manage unsubscriptions. Export logs for compliance reviews or
            backups whenever needed.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={exportHref}
            prefetch={false}
            className="inline-flex items-center justify-center rounded-full border border-neutral-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-[1px] hover:border-primary-300 hover:text-primary-600 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:text-neutral-200 dark:hover:border-primary-500/50"
          >
            Download CSV
          </Link>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-neutral-100/70 bg-white/80 p-6 shadow-md dark:border-neutral-800/70 dark:bg-neutral-950/80">
          <form method="get" className="grid gap-4 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
            <div className="flex flex-col gap-2">
              <label htmlFor="search" className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
                Filter by email
              </label>
              <input
                id="search"
                name="search"
                defaultValue={search}
                placeholder="user@example.com"
                className="w-full rounded-full border border-neutral-200 bg-white/90 px-4 py-2 text-sm text-neutral-600 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-100 dark:focus:border-primary-600 dark:focus:ring-primary-700/30"
                type="search"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={statusFilter}
                className="w-full rounded-full border border-neutral-200 bg-white/90 px-4 py-2 text-sm text-neutral-600 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-100 dark:focus:border-primary-600 dark:focus:ring-primary-700/30"
              >
                {statusFilters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-[1px] hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Apply
              </button>
              {(search || statusFilter) && (
                <Link
                  href="/admin/newsletter"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500"
                >
                  Reset
                </Link>
              )}
            </div>
          </form>
        </div>
        <EraseNewsletterByEmail initialEmail={search} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
          <span>{signups.length} record{signups.length === 1 ? '' : 's'}</span>
          <span>Newest first</span>
        </div>

        <div className="space-y-4">
          {signups.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-200/70 bg-white/60 px-6 py-12 text-center text-sm text-neutral-500 dark:border-neutral-700/70 dark:bg-neutral-900/60 dark:text-neutral-400">
              No newsletter records match the selected filter.
            </div>
          ) : (
            signups.map((signup) => (
              <article
                key={signup.id}
                className="grid gap-4 rounded-3xl border border-neutral-100/70 bg-white/80 p-6 shadow-md transition hover:-translate-y-[1px] hover:shadow-lg dark:border-neutral-800/70 dark:bg-neutral-950/80"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{signup.email}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Joined {formatTimestamp(signup.createdAt)}</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <UpdateSignupStatus id={signup.id} status={signup.status} />
                    <DeleteSignupButton id={signup.id} email={signup.email} />
                  </div>
                </div>

                <div className="grid gap-2 text-xs text-neutral-500 dark:text-neutral-400 sm:grid-cols-2">
                  <div className="rounded-2xl border border-neutral-100/70 bg-white/90 p-3 dark:border-neutral-800/70 dark:bg-neutral-900/60">
                    <p className="font-semibold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">Consent</p>
                    <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                      {signup.consent ? 'Granted' : 'Missing'}
                    </p>
                    <p className="text-neutral-400 dark:text-neutral-500">At {formatTimestamp(signup.consentAt)}</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-100/70 bg-white/90 p-3 dark:border-neutral-800/70 dark:bg-neutral-900/60">
                    <p className="font-semibold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">Source</p>
                    <p className="mt-1 text-neutral-600 dark:text-neutral-300">{signup.sourcePath ?? 'Unknown'}</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-100/70 bg-white/90 p-3 dark:border-neutral-800/70 dark:bg-neutral-900/60">
                    <p className="font-semibold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">Double opt-in</p>
                    <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                      {signup.doubleOptInSentAt ? `Sent ${formatTimestamp(signup.doubleOptInSentAt)}` : 'Not sent'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-neutral-100/70 bg-white/90 p-3 dark:border-neutral-800/70 dark:bg-neutral-900/60">
                    <p className="font-semibold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">Confirmation</p>
                    <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                      {signup.confirmedAt ? `Confirmed ${formatTimestamp(signup.confirmedAt)}` : 'Not confirmed'}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
