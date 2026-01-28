import type { Metadata } from 'next';
import { CheckoutButton } from '@/components/ui/CheckoutButton';
import { PremiumPricing } from '@/components/pro/PremiumPricing';
import { NewsletterShowcase } from '@/components/sections/NewsletterShowcase';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { Sparkles, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Membership',
  description: 'Invest in your peace of mind. Full access to the NoStress AI system.'
};

const rows = [
  { label: 'Content access', free: 'Curated selection', plus: 'All sections unlocked', lifetime: 'All sections unlocked' },
  { label: 'Pillar alerts', free: 'Standard profile notifications', plus: 'Priority feed + Archive access', lifetime: 'Priority feed + Archive access' },
  { label: 'Newsletter', free: 'Sold separately', plus: 'Included', lifetime: 'Included' },
  { label: 'Interactive Labs', free: 'Basic', plus: 'Full Access', lifetime: 'Full Access + Early Beta' },
  { label: 'Roadmap Voting', free: '-', plus: 'Standard', lifetime: 'Direct Input' }
];

export default function ProPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">

      {/* Immersive Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary-200/20 via-accent-200/10 to-transparent dark:from-primary-900/10 dark:via-accent-900/10 blur-[100px] rounded-[100%]" />
        </div>

        <div className="site-container relative z-10 text-center space-y-8">
          <MotionWrapper delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary-700 dark:border-primary-800/50 dark:bg-black/30 dark:text-primary-300 backdrop-blur-md shadow-sm">
              Membership
            </div>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <h1 className="font-serif text-5xl lg:text-7xl font-medium text-neutral-900 dark:text-white leading-[1.1] tracking-tight">
              Invest in your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
                peace of mind.
              </span>
            </h1>
          </MotionWrapper>

          <MotionWrapper delay={0.3}>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Choose the plan that fits your journey. From a simple monthly newsletter to full access to our calming tools and community.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Newsletter Showcase (Prioritized) */}
      <section className="site-container pb-20 relative z-30">
        <MotionWrapper delay={0.35}>
          <NewsletterShowcase />
        </MotionWrapper>
      </section>

      {/* Pricing Section */}
      <section className="pb-24 relative z-20">
        <MotionWrapper delay={0.4}>
          <PremiumPricing />
        </MotionWrapper>
      </section>

      {/* Detailed Comparison */}
      <section className="site-container pb-32">
        <MotionWrapper delay={0.6}>
          <div className="rounded-[3rem] border border-neutral-200 bg-white/80 p-8 lg:p-12 shadow-xl shadow-neutral-200/20 dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-none backdrop-blur-xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-medium text-neutral-900 dark:text-white mb-4">Detailed Breakdown</h2>
              <p className="text-neutral-500 dark:text-neutral-400">Exactly what&apos;s included in each tier.</p>
            </div>

            <div className="overflow-x-auto -mx-8 lg:mx-0">
              <table className="w-full text-sm text-neutral-600 dark:text-neutral-300 min-w-[700px]">
                <thead className="border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-8 py-6 text-left font-serif text-lg font-medium text-neutral-900 dark:text-white w-1/4">Feature</th>
                    <th className="px-8 py-6 text-center font-medium text-neutral-500 w-1/4">Basic (Free)</th>
                    <th className="px-8 py-6 text-center font-medium text-primary-600 dark:text-primary-400 text-lg w-1/4">NoStress+</th>
                    <th className="px-8 py-6 text-center font-medium text-amber-600 dark:text-amber-500 text-lg w-1/4">Lifetime</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="px-8 py-5 font-medium text-neutral-900 dark:text-white">{row.label}</td>
                      <td className="px-8 py-5 text-center">{row.free}</td>
                      <td className="px-8 py-5 text-center font-medium text-neutral-900 dark:text-white bg-primary-50/30 dark:bg-primary-900/10 rounded-lg">{row.plus}</td>
                      <td className="px-8 py-5 text-center font-medium text-neutral-900 dark:text-white">{row.lifetime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MotionWrapper>
      </section>
    </div>
  );
}
