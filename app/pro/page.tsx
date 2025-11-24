import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckoutButton } from '@/components/ui/CheckoutButton';

export const metadata: Metadata = {
  title: 'NoStress+ plans',
  description: 'Compare the free plan, NoStress+, and the newsletter-only option.'
};

const freeFeatures = [
  'Limited access to articles and resources',
  'Choose 2–3 pillars; get in-app alerts when new content lands there',
  'Access to public videos and upcoming live streams',
  'Manual progress tracking'
];

const plusFeatures = [
  'Full library access (articles, resources, videos, tools)',
  'Priority pillar alerts plus archive of past updates',
  'Weekly NoStress Memo (1 insight, 1 prompt, 1 reflection)',
  'Support for future interactive labs and community moments'
];

const rows = [
  { label: 'Content access', free: 'Curated selection', plus: 'All sections unlocked' },
  { label: 'Pillar alerts', free: 'In-app profile notifications', plus: 'In-app priority feed + future push alerts' },
  { label: 'Newsletter', free: 'Sold separately', plus: 'Sold separately' },
  { label: 'Price', free: '€0 / month', plus: '€5 / month (intro price)' }
];

import { CheckoutStatus } from '@/components/pro/CheckoutStatus';

export default function ProPage() {
  return (
    <div className="site-container space-y-16 pb-20">
      <CheckoutStatus />
      <section className="rounded-[32px] border border-neutral-100/70 bg-gradient-to-br from-neutral-25 via-white to-primary-50/60 p-10 shadow-[0_45px_90px_-70px_rgba(39,58,54,0.55)] dark:border-neutral-800/60 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/40 md:p-16">
        <div className="max-w-3xl space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 dark:border-primary-700/40 dark:bg-primary-900/30 dark:text-primary-200">
            NoStress+
          </p>
          <h1 className="font-serif text-4xl leading-tight text-neutral-800 dark:text-neutral-50 md:text-5xl">
            Two ways to stay calm.
            <br />
            Newsletter optional.
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            The free plan keeps pillar notifications in-app. NoStress+ unlocks everything and gives you priority access to new tools
            and labs. If you just want the monthly AI digest, subscribe to the €0.99 memo separately.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login">
              <Button size="lg">Sign in &amp; pick pillars</Button>
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-primary-600 hover:underline">
              Talk to us →
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <PlanCard title="NoStress Free" price="€0 / month" cta="Stay free" href="/profile" description="Perfect to explore the tools and get calm notifications.">
          <FeatureList items={freeFeatures} />
        </PlanCard>
        <PlanCard
          title="NoStress+"
          price="€5 / month"
          highlight="Popular"
          cta="Join NoStress+"
          checkoutPlan="plus"
          description="All content + tools unlocked, priority access to new labs. Newsletter sold separately."
        >
          <FeatureList items={plusFeatures} />
        </PlanCard>
      </section>

      <section className="rounded-[28px] border border-neutral-100 bg-white/90 p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Free vs. NoStress+</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Snap comparison of the two tiers.</p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-800">
          <table className="w-full text-sm text-neutral-600 dark:text-neutral-300">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-[0.2em] text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">Free</th>
                <th className="px-4 py-3">NoStress+</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-neutral-100 dark:border-neutral-800">
                  <td className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-100">{row.label}</td>
                  <td className="px-4 py-3">{row.free}</td>
                  <td className="px-4 py-3 text-primary-600 dark:text-primary-300">{row.plus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[28px] border border-neutral-100 bg-neutral-25 p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">Weekly memo</p>
            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Newsletter-only · €0.99 / month</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              One insight, one prompt, one reflection. For now, subscribe by pinging us to be added manually—billing hooks up soon.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <CheckoutButton plan="newsletter">
              Subscribe (€0.99)
            </CheckoutButton>
            <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
              Stripe checkout · cancel anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PlanCard({
  title,
  price,
  description,
  highlight,
  cta,
  href,
  checkoutPlan,
  children
}: {
  title: string;
  price: string;
  description: string;
  highlight?: string;
  cta: string;
  href?: string;
  checkoutPlan?: 'newsletter' | 'plus';
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-3xl border border-neutral-100 bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
      {highlight && (
        <span className="absolute -right-3 top-4 rounded-full bg-primary-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
          {highlight}
        </span>
      )}
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{title}</h2>
      <p className="mt-1 text-lg text-primary-600 dark:text-primary-300">{price}</p>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
      <div className="mt-4">{children}</div>
      {checkoutPlan ? (
        <CheckoutButton plan={checkoutPlan} className="mt-6 w-full">
          {cta}
        </CheckoutButton>
      ) : (
        <Link href={href ?? '/login'}>
          <Button className="mt-6 w-full">{cta}</Button>
        </Link>
      )}
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-1 h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
