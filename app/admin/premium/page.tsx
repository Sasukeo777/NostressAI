import Link from 'next/link';
import type { Metadata } from 'next';

import { listMembers } from '@/lib/server/members';
import { UpdatePlanForm } from './UpdatePlanForm';
import type { HolisticPillar } from '@/lib/types';

export const metadata: Metadata = {
  title: 'NoStress+ members | Admin',
  description: 'Manage paid tiers and prep manual newsletter sends.'
};

function formatPillars(pillars: HolisticPillar[]) {
  if (!pillars.length) return '—';
  return pillars.join(', ');
}

function formatTimestamp(value: string | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 16).replace('T', ' ');
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  plus: 'NoStress+',
  newsletter: 'Newsletter-only'
};

export default async function PremiumAdminPage() {
  const members = await listMembers();
  const plusMembers = members.filter((member) => member.plan === 'plus');
  const newsletterMembers = members.filter((member) => member.plan === 'newsletter');

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/50 bg-white/80 p-8 shadow-lg ring-1 ring-primary-500/10 dark:border-neutral-800/70 dark:bg-neutral-950/70 dark:ring-white/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
              NoStress+
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Paid members</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Track who has access to NoStress+ (full content + tools) and who subscribes only to the paid newsletter. Until webhooks
              flip plans automatically, toggle membership manually and use the lists below for any broadcast.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="rounded-2xl border border-neutral-200/80 bg-white/60 px-6 py-4 text-center text-sm font-semibold text-neutral-700 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-900/60 dark:text-neutral-200">
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 dark:text-neutral-500">NoStress+</p>
              <p className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">{plusMembers.length}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white/60 px-6 py-4 text-center text-sm font-semibold text-neutral-700 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-900/60 dark:text-neutral-200">
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 dark:text-neutral-500">Newsletter-only</p>
              <p className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">{newsletterMembers.length}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-neutral-100/70 bg-white/85 p-6 shadow-md dark:border-neutral-800/70 dark:bg-neutral-950/80">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">Manual send</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Paste the emails below into BCC of your subdomain mailbox (e.g. <code>news@updates.nostress-ai.com</code>). Keep the To
            field pointing to yourself so deliverability stays tidy.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">NoStress+</p>
              <textarea
                className="mt-2 h-28 w-full rounded-2xl border border-neutral-200 bg-white/90 p-3 text-xs text-neutral-600 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-700/30"
                defaultValue={plusMembers.map((member) => member.email).join(', ')}
                readOnly
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">Newsletter-only (€0.99)</p>
              <textarea
                className="mt-2 h-28 w-full rounded-2xl border border-neutral-200 bg-white/90 p-3 text-xs text-neutral-600 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-700/30"
                defaultValue={newsletterMembers.map((member) => member.email).join(', ')}
                readOnly
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            <Link
              href="/admin/premium/export"
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-[1px] hover:border-primary-300 hover:text-primary-600 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:border-primary-500/50"
            >
              Download CSV
            </Link>
            <span className="rounded-full border border-dashed border-neutral-300 px-3 py-2">
              Pillar mix: {plusMembers.reduce((acc, member) => acc + member.favoritePillars.length, 0)} total tags
            </span>
          </div>
        </div>
        <div className="rounded-3xl border border-amber-200/70 bg-amber-50/70 p-6 dark:border-amber-500/40 dark:bg-amber-500/10">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">Weekly ritual</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-amber-900 dark:text-amber-100">
            <li>Draft the paid newsletter (Notion, Google Doc, etc.).</li>
            <li>Copy the newsletter-only recipients (and NoStress+ if you ever need to reach them) as needed.</li>
            <li>Send via your subdomain mailbox using BCC + Resend SMTP.</li>
            <li>Update this dashboard if anyone downgrades or upgrades.</li>
          </ol>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
          <span>{members.length} member{members.length === 1 ? '' : 's'}</span>
          <span>Newest profile updates first</span>
        </div>
        <div className="space-y-4">
          {members.map((member) => (
            <article
              key={member.userId}
              className="grid gap-3 rounded-3xl border border-neutral-100/70 bg-white/85 p-5 shadow-sm transition hover:-translate-y-[1px] hover:shadow-lg dark:border-neutral-800/70 dark:bg-neutral-950/80"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{member.email}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {member.displayName ?? 'Unnamed'} · Updated {formatTimestamp(member.updatedAt)}
                  </p>
                </div>
                <UpdatePlanForm userId={member.userId} initialPlan={member.plan} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="rounded-full border border-neutral-200 px-3 py-1 dark:border-neutral-700">
                  Pillars: {formatPillars(member.favoritePillars)}
                </span>
                <span className="rounded-full border border-neutral-200 px-3 py-1 dark:border-neutral-700">
                  Plan: {PLAN_LABELS[member.plan] ?? member.plan}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
