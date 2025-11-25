import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckoutButton } from '@/components/ui/CheckoutButton';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
  'Monthly NoStress Newsletter (5 AI News + 1 Deep Dive Article)',
  'Support for future interactive labs and community moments'
];

const lifetimeFeatures = [
  'Everything in NoStress+',
  'One-time payment, forever access',
  'Early access to new features',
  'Direct input on future roadmap'
];

const rows = [
  { label: 'Content access', free: 'Curated selection', plus: 'All sections unlocked', lifetime: 'All sections unlocked' },
  { label: 'Pillar alerts', free: 'In-app profile notifications', plus: 'In-app priority feed + future push alerts', lifetime: 'In-app priority feed + future push alerts' },
  { label: 'Newsletter', free: 'Sold separately', plus: 'Included', lifetime: 'Included' },
  { label: 'Price', free: '$0 / month', plus: '$5 / month', lifetime: '$149 one-time' }
];

import { CheckoutStatus } from '@/components/pro/CheckoutStatus';

export default function ProPage() {
  return (
    <div className="site-container space-y-20 pb-20">
      <CheckoutStatus />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-primary-50/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:border-primary-800/50 dark:bg-primary-900/20 dark:text-primary-300">
          Membership
        </div>
        <h1 className="font-serif text-4xl leading-tight text-neutral-900 dark:text-white md:text-6xl">
          Invest in your <br />
          <span className="text-primary-600 dark:text-primary-400">peace of mind.</span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Choose the plan that fits your journey. From a simple monthly newsletter to full access to our calming tools and community.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-6 items-start">
        {/* Free Plan */}
        <PlanCard
          title="Free"
          price="$0"
          period="/ month"
          description="Explore the basics and get calm notifications."
          cta="Stay free"
          href="/profile"
        >
          <FeatureList items={freeFeatures} />
        </PlanCard>

        {/* Plus Plan */}
        <PlanCard
          title="NoStress+"
          price="$5"
          period="/ month"
          highlight="Most Popular"
          cta="Join NoStress+"
          checkoutPlan="plus"
          description="Unlock the full library and monthly newsletter."
          featured={true}
        >
          <FeatureList items={plusFeatures} />
        </PlanCard>

        {/* Lifetime Plan */}
        <PlanCard
          title="Lifetime"
          price="$149"
          period="one-time"
          cta="Get Lifetime Access"
          checkoutPlan="lifetime" // Note: Backend needs to handle 'lifetime' plan
          description="Pay once, own it forever. Best value."
        >
          <FeatureList items={lifetimeFeatures} />
        </PlanCard>
      </div>

      {/* Comparison Table */}
      <section className="rounded-[32px] border border-neutral-200 bg-white/50 p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 backdrop-blur-sm">
        <h2 className="text-2xl font-serif font-medium text-neutral-900 dark:text-white mb-8 text-center">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-neutral-600 dark:text-neutral-300 min-w-[600px]">
            <thead className="border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-neutral-900 dark:text-white w-1/4">Feature</th>
                <th className="px-6 py-4 text-center font-medium w-1/4">Free</th>
                <th className="px-6 py-4 text-center font-medium text-primary-600 dark:text-primary-400 w-1/4">NoStress+</th>
                <th className="px-6 py-4 text-center font-medium text-neutral-900 dark:text-white w-1/4">Lifetime</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{row.label}</td>
                  <td className="px-6 py-4 text-center">{row.free}</td>
                  <td className="px-6 py-4 text-center font-medium text-primary-600 dark:text-primary-400">{row.plus}</td>
                  <td className="px-6 py-4 text-center font-medium text-neutral-900 dark:text-white">{row.lifetime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="rounded-[32px] border border-neutral-200 bg-neutral-50 p-10 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Sparkles className="h-3 w-3" />
              Newsletter Only
            </div>
            <h3 className="font-serif text-3xl font-medium text-neutral-900 dark:text-white">
              Just want the updates? <br />
              <span className="text-neutral-500">$0.99 / month</span>
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl">
              Get our highly structured, low-volume monthly digest featuring <strong>5 AI News</strong> + <strong>1 Deep Dive Article</strong>. No other bells and whistles.
            </p>
          </div>
          <div className="flex flex-col gap-3 min-w-[200px]">
            <CheckoutButton plan="newsletter" size="lg" className="w-full">
              Subscribe ($0.99)
            </CheckoutButton>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 text-center">
              Stripe checkout · cancel anytime
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
  period,
  description,
  highlight,
  cta,
  href,
  checkoutPlan,
  featured = false,
  children
}: {
  title: string;
  price: string;
  period: string;
  description: string;
  highlight?: string;
  cta: string;
  href?: string;
  checkoutPlan?: 'newsletter' | 'plus' | 'lifetime';
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(
      "relative flex flex-col h-full rounded-[2rem] p-8 transition-all duration-300",
      featured
        ? "bg-neutral-900 text-white shadow-2xl shadow-neutral-900/20 dark:bg-white dark:text-neutral-900 ring-1 ring-neutral-900/5 dark:ring-white/10 scale-105 z-10"
        : "bg-white border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 dark:bg-neutral-900 dark:border-neutral-800"
    )}>
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg">
          {highlight}
        </span>
      )}

      <div className="mb-8">
        <h2 className={cn("text-xl font-medium mb-2", featured ? "text-white dark:text-neutral-900" : "text-neutral-900 dark:text-white")}>{title}</h2>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-4xl font-serif", featured ? "text-white dark:text-neutral-900" : "text-neutral-900 dark:text-white")}>{price}</span>
          <span className={cn("text-sm", featured ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-500 dark:text-neutral-400")}>{period}</span>
        </div>
        <p className={cn("mt-4 text-sm leading-relaxed", featured ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-500 dark:text-neutral-400")}>{description}</p>
      </div>

      <div className="flex-grow mb-8">
        {children}
      </div>

      {checkoutPlan ? (
        <CheckoutButton
          plan={checkoutPlan as any}
          className={cn("w-full", featured ? "bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800" : "")}
          variant={featured ? "default" : "outline"}
        >
          {cta}
        </CheckoutButton>
      ) : (
        <Link href={href ?? '/login'} className="w-full">
          <Button className="w-full" variant="outline">{cta}</Button>
        </Link>
      )}
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4 text-sm">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500/20 text-primary-600 dark:bg-primary-400/20 dark:text-primary-400">
            <Check className="h-2.5 w-2.5" />
          </div>
          <span className="opacity-80">{item}</span>
        </li>
      ))}
    </ul>
  );
}
