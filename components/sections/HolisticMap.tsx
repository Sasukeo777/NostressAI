'use client';

import Link from 'next/link';
import type { HolisticPillar } from '@/lib/types';
import { HOLISTIC_PILLARS } from '@/lib/pillars';
import { cn } from '@/lib/utils/cn';

const PILLAR_SECTIONS: { title: string; description: string; pillars: HolisticPillar[] }[] = [
  {
    title: 'Regulate the body',
    description: 'Energy, sleep, and somatic resets that stabilise the nervous system.',
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

const PILLAR_INDEX = HOLISTIC_PILLARS.reduce<Record<HolisticPillar, (typeof HOLISTIC_PILLARS)[number]>>((acc, pillar) => {
  acc[pillar.id] = pillar;
  return acc;
}, {} as Record<HolisticPillar, (typeof HOLISTIC_PILLARS)[number]>);

const CARD_BASE = 'group accent-panel rounded-[22px] p-6 text-center transition';

export function HolisticMap() {
  return (
    <section className="accent-section relative left-1/2 right-1/2 w-screen -translate-x-1/2 py-12">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-primary-500/80 dark:text-primary-300/80">Holistic Stress Lens</span>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-neutral-700 dark:text-neutral-50">Nine pillars, organised in three mindsets.</h2>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          Stress is systemic. Start with the body, tune your systems, then zoom out to meaning. Each pillar stacks so progress feels doable.
        </p>
        <div className="mt-5 flex justify-center">
          <Link
            href="/approach"
            className="inline-flex items-center rounded-full border border-primary-200/50 bg-white px-5 py-2 text-sm font-medium text-primary-600 shadow-sm transition hover:border-primary-300 hover:text-primary-500 dark:border-primary-700/40 dark:bg-neutral-900 dark:text-primary-200"
          >
            Explore the holistic approach →
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-10 grid w-full max-w-6xl gap-6 px-6 md:px-10 lg:grid-cols-3">
        {PILLAR_SECTIONS.map((section) => (
          <article key={section.title} className={CARD_BASE}>
            <div className="flex flex-col items-center gap-2">
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:bg-neutral-800/80 dark:text-neutral-200">
                {section.pillars.length} pillars
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-100">{section.title}</p>
            </div>
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-200">{section.description}</p>
            <div className="mt-4 grid gap-3">
              {section.pillars.map((pillarId) => {
                const pillar = PILLAR_INDEX[pillarId];
                if (!pillar) return null;
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.id}
                    className={cn(
                      'flex items-start gap-3 rounded-2xl border border-transparent p-4 text-sm shadow-[0_20px_35px_-35px_rgba(39,58,54,0.6)] transition hover:-translate-y-0.5',
                      pillar.accentLight,
                      pillar.accentDark
                    )}
                  >
                    <span className="rounded-xl bg-white/70 p-2 text-neutral-600 shadow-sm dark:bg-black/30">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-600/80 dark:text-neutral-200/80">{pillar.name}</p>
                      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-50">{pillar.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5">
              <Link
                href="/approach"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-600 transition hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-200"
              >
                Deep-dive →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
