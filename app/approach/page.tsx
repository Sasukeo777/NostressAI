import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { HOLISTIC_PILLARS } from '@/lib/pillars';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = {
  title: 'Our Approach',
  description:
    'NoStress AI treats stress as a systemic signal. Explore the six pillars—nutrition, work systems, sleep, mind & body, AI support, analog tools.'
};

export default function ApproachPage() {
  const clusters = [
    {
      title: 'Regulate the body',
      description: 'Energy, sleep, and somatic resets keep the nervous system steady.',
      pillars: ['nutrition', 'sleep', 'mind-body']
    },
    {
      title: 'Refine the systems',
      description: 'Design workflows, AI guardrails, and tactile buffers that remove friction.',
      pillars: ['work', 'ai-tools', 'analog-tools']
    },
    {
      title: 'Expand the horizon',
      description: 'Learning, context, and purpose so small routines ladder up to meaning.',
      pillars: ['neuroplasticity', 'societal-impact', 'purpose']
    }
  ];

  return (
    <div className="space-y-16">
      <section className="rounded-[32px] border border-neutral-100 bg-white/90 p-10 shadow-[0_45px_90px_-70px_rgba(39,58,54,0.45)] dark:border-neutral-800/60 dark:bg-neutral-900/70 md:p-16">
        <div className="max-w-3xl space-y-5">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-primary-500/80 dark:text-primary-300/80">
            Why holistic?
          </span>
          <h1 className="font-serif text-4xl font-semibold text-neutral-700 dark:text-neutral-50">Stress is systemic—so is our method.</h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Acute stress is a signal that nutrition, sleep, workflows, somatic recovery, or tool stacks are out of alignment. We map your landscape,
            shore up the easiest wins first, and build a living system that keeps your nervous system informed—not overwhelmed.
          </p>
          <p className="text-neutral-600 dark:text-neutral-300">
            Below are the six pillars we iterate with. You don’t need to overhaul everything at once—start with the area creating the loudest friction
            and we’ll cross-pollinate improvements across the others.
          </p>
        </div>
      </section>

      <SectionHeading title="Nine pillars, three mindsets" eyebrow="Holistic Stress Map" />
      <div className="grid gap-10 lg:grid-cols-3">
        {clusters.map((cluster) => (
          <article key={cluster.title} className="accent-panel h-full rounded-[26px] p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-200">{cluster.title}</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-200">{cluster.description}</p>
            <div className="mt-5 space-y-4">
              {cluster.pillars.map((pillarId) => {
                const pillar = HOLISTIC_PILLARS.find((p) => p.id === pillarId);
                if (!pillar) return null;
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.id}
                    className={cn(
                      'rounded-2xl border border-transparent p-4 text-left transition hover:-translate-y-0.5',
                      pillar.accentLight,
                      pillar.accentDark
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-white/80 p-2 text-neutral-600 shadow-sm dark:bg-black/30">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-600/70 dark:text-neutral-200/80">{pillar.name}</p>
                        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-50">{pillar.tagline}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-neutral-600/90 dark:text-neutral-200/80">{pillar.description}</p>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <SectionHeading title="Where to begin" eyebrow="Pick your next step" />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-100 bg-white/90 p-6 dark:border-neutral-800/70 dark:bg-neutral-900/60">
          <h3 className="font-serif text-lg font-semibold text-neutral-700 dark:text-neutral-50">Quick self-scan</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Notice where stress shows up first: digestion, sleep, schedule chaos, physical tension? Start with that pillar and stabilise a single habit.
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-100 bg-white/90 p-6 dark:border-neutral-800/70 dark:bg-neutral-900/60">
          <h3 className="font-serif text-lg font-semibold text-neutral-700 dark:text-neutral-50">Pair pillars</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Improvements stick when anchors reinforce each other—link sleep cues with analog tools, or nutrition shifts with workday rituals.
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-100 bg-white/90 p-6 dark:border-neutral-800/70 dark:bg-neutral-900/60">
          <h3 className="font-serif text-lg font-semibold text-neutral-700 dark:text-neutral-50">Prefer guided support?</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Our courses blend bite-sized theory with templates and tools across the relevant pillars.
          </p>
          <Link href="/courses" className="mt-3 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-200">
            Browse courses →
          </Link>
        </div>
      </div>
    </div>
  );
}
