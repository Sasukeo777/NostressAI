import Link from 'next/link';
import type { Metadata } from 'next';

import { listContactMessages } from '@/lib/server/contactMessages';
import { DeleteMessageButton } from './DeleteMessageButton';
import { EraseMessagesByEmail } from './EraseMessagesByEmail';

export const metadata: Metadata = {
  title: 'Contact messages | Admin',
  description: 'Review inbound contact form submissions and fulfil GDPR deletion requests.'
};

function formatTimestamp(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return `${date.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

interface MessagesPageProps {
  searchParams?: { search?: string };
}

export default async function AdminMessagesPage({ searchParams }: MessagesPageProps) {
  const search = typeof searchParams?.search === 'string' ? searchParams.search.trim() : '';

  const messages = await listContactMessages({
    search: search || undefined,
    limit: 300
  });

  const exportHref = `/admin/messages/export${search ? `?search=${encodeURIComponent(search)}` : ''}`;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 rounded-3xl border border-white/50 bg-white/80 p-8 shadow-lg ring-1 ring-primary-500/10 dark:border-neutral-800/70 dark:bg-neutral-950/70 dark:ring-white/5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
            Inbox
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Contact messages</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Every contact form submission stored for follow-up. Records include explicit consent timestamps to support GDPR audits.
            Use the export button for offline analysis or archive.
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
          <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label htmlFor="search" className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
                Filter by email
              </label>
              <input
                id="search"
                name="search"
                defaultValue={search}
                placeholder="user@example.com"
                className="mt-2 w-full rounded-full border border-neutral-200 bg-white/90 px-4 py-2 text-sm text-neutral-600 outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-100 dark:focus:border-primary-600 dark:focus:ring-primary-700/30"
                type="search"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-[1px] hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Apply
              </button>
              {search ? (
                <Link
                  href="/admin/messages"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500"
                >
                  Reset
                </Link>
              ) : null}
            </div>
          </form>
        </div>
        <EraseMessagesByEmail initialEmail={search} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
          <span>{messages.length} record{messages.length === 1 ? '' : 's'}</span>
          <span>Newest first</span>
        </div>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-200/70 bg-white/60 px-6 py-12 text-center text-sm text-neutral-500 dark:border-neutral-700/70 dark:bg-neutral-900/60 dark:text-neutral-400">
              No contact messages found for the selected filter.
            </div>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                className="grid gap-4 rounded-3xl border border-neutral-100/70 bg-white/80 p-6 shadow-md transition hover:-translate-y-[1px] hover:shadow-lg dark:border-neutral-800/70 dark:bg-neutral-950/80"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                      {message.fullName || 'Unknown sender'}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{message.email}</p>
                  </div>
                  <div className="text-xs text-neutral-400 dark:text-neutral-500">
                    Submitted {formatTimestamp(message.createdAt)}
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-100/80 bg-white/90 p-4 text-sm leading-relaxed text-neutral-700 shadow-inner dark:border-neutral-800/70 dark:bg-neutral-900/60 dark:text-neutral-200">
                  <p className="whitespace-pre-line">{message.message}</p>
                </div>

                <div className="flex flex-col gap-3 text-xs text-neutral-500 dark:text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase text-emerald-600 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-200">
                      Consent {message.consent ? 'granted' : 'missing'}
                    </span>
                    <span>Consent at {formatTimestamp(message.consentAt)}</span>
                    {message.originPath ? <span>Origin: {message.originPath}</span> : null}
                    {message.userAgent ? <span>UA: {message.userAgent}</span> : null}
                  </div>
                  <DeleteMessageButton id={message.id} email={message.email} />
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
