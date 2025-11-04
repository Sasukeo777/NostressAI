import Link from 'next/link';
import { listFormations } from '@/lib/server/formations';
import { getAllPosts } from '@/lib/blog';
import { getAllResources } from '@/lib/resources';
import { countContactMessages } from '@/lib/server/contactMessages';
import { countNewsletterSignups } from '@/lib/server/newsletter';

export default async function AdminPage() {
  const [formations, posts, resources, contactCount, newsletterCount] = await Promise.all([
    listFormations(),
    getAllPosts(),
    getAllResources(),
    countContactMessages(),
    countNewsletterSignups()
  ]);

  const stats = [
    { label: 'Articles', count: posts.length, href: '/blog' },
    { label: 'Formations', count: formations.length, href: '/courses' },
    { label: 'Resources', count: resources.length, href: '/resources' },
    { label: 'Contact messages', count: contactCount, href: '/admin/messages' },
    { label: 'Newsletter signups', count: newsletterCount, href: '/admin/newsletter' }
  ];

  const quickActions = [
    {
      title: 'Create article',
      copy: 'Publish research-driven longform in MDX, assign pillars, and ship instantly to the blog.',
      cta: 'New article',
      href: '/admin/articles'
    },
    {
      title: 'Create course',
      copy: 'Outline a formation, plug in modules, and point learners to Udemy or your own CTA.',
      cta: 'New course',
      href: '/admin/courses'
    },
    {
      title: 'Create resource',
      copy: 'Add a practical tip or study synopsis, tag it with pillars, and surface it on the resource library.',
      cta: 'New resource',
      href: '/admin/resources/new'
    },
    {
      title: 'Review contact inbox',
      copy: 'Respond to inbound requests, confirm consent, and delete data on demand.',
      cta: 'Open messages',
      href: '/admin/messages'
    },
    {
      title: 'Audit newsletter log',
      copy: 'Track opt-ins, handle unsubscribes, and export compliant mailing lists.',
      cta: 'Open newsletter',
      href: '/admin/newsletter'
    },
    {
      title: 'Edit About page',
      copy: 'Refresh the manifesto that powers the public About page with live MDX content.',
      cta: 'Edit About',
      href: '/admin/about'
    }
  ];

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-8 shadow-xl ring-1 ring-primary-500/10 backdrop-blur dark:border-neutral-800/80 dark:bg-neutral-950/70 dark:ring-white/5 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_45%)] opacity-80 dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_45%)]" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
              Admin hub
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
              Keep the NoStress AI ecosystem calm and current.
            </h1>
            <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              Ship articles, courses, and manifesto updates from one streamlined console. Your changes sync instantly to the live experience.
            </p>
            <ul className="grid gap-3 text-sm text-neutral-600 dark:text-neutral-400 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Live MDX previews and Supabase storage
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Pillar-aware content taxonomy
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                Quick links to public pages
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Instant revalidation on publish
              </li>
            </ul>
          </div>
          <div className="grid w-full max-w-sm gap-4 rounded-2xl border border-white/60 bg-white/60 p-6 shadow-lg backdrop-blur dark:border-neutral-800/80 dark:bg-neutral-950/60">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Live snapshot</p>
            <div className="space-y-3">
              {stats.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-3 text-sm transition hover:-translate-y-[2px] hover:border-primary-500/40 hover:shadow-lg dark:border-neutral-800/70 dark:bg-neutral-900/60 dark:hover:border-primary-400/60"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">{item.label}</p>
                    <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{item.count}</p>
                  </div>
                  <span className="text-xs font-medium text-primary-600 transition group-hover:translate-x-1 dark:text-primary-300">
                    View
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((item) => (
          <div
            key={item.title}
            className="flex h-full flex-col gap-4 rounded-3xl border border-white/50 bg-white/80 p-7 shadow-lg ring-1 ring-neutral-900/5 transition hover:-translate-y-[2px] hover:shadow-xl dark:border-neutral-800/70 dark:bg-neutral-950/70 dark:ring-white/5"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{item.title}</h2>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.copy}</p>
            </div>
            <div className="mt-auto">
              <Link
                href={item.href}
                className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-neutral-900/10 transition hover:-translate-y-[1px] hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
              >
                {item.cta}
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
