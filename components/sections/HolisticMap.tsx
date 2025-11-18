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
    <section className="accent-section relative left-1/2 right-1/2 w-screen -translate-x-1/2 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-primary-500 dark:text-primary-200">Holistic Stress Lens</span>
            <h2 className="font-serif text-3xl font-semibold text-neutral-800 dark:text-neutral-50">Nine pillars, three mindsets, one calmer system.</h2>
            <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl">
              Start with the pillar causing the most friction, then layer the others. Everything works better when body, systems, and meaning align.
            </p>
          </div>
          <Link
            href="/approach"
            className="inline-flex items-center rounded-full border border-primary-200/60 bg-white px-5 py-2 text-sm font-medium text-primary-600 shadow-sm transition hover:border-primary-300 hover:text-primary-500 dark:border-primary-700/40 dark:bg-neutral-900 dark:text-primary-200"
          >
            Explore the approach →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            {PILLAR_SECTIONS.map((section) => (
              <div key={section.title} className="accent-panel rounded-2xl p-4 text-left">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-200">{section.title}</p>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{section.description}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOLISTIC_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              const section = PILLAR_SECTIONS.find((s) => s.pillars.includes(pillar.id));
              return (
                <article
                  key={pillar.id}
                  className={cn(
                    'accent-panel h-full rounded-2xl p-4 text-left transition hover:-translate-y-1',
                    pillar.accentLight,
                    pillar.accentDark
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-white/70 p-2 text-neutral-600 shadow-sm dark:bg-black/30">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-neutral-600/80 dark:text-neutral-200/80">
                        {section?.title}
                      </p>
                      <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-50">{pillar.name}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-neutral-700 dark:text-neutral-100">{pillar.tagline}</p>
                  <p className="mt-2 text-xs text-neutral-600/90 dark:text-neutral-200/80">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
