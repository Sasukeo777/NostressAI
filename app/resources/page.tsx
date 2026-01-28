import { getAllResources } from '@/lib/resources';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PillarBadge } from '@/components/ui/PillarBadge';
import { PillarFilters } from '@/components/ui/PillarFilters';
import type { HolisticPillar } from '@/lib/types';
import { PILLAR_IDS } from '@/lib/pillars';
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';
import { Suspense } from 'react';

// export const dynamic = 'force-dynamic'; // Incompatible with cacheComponents

async function ResourcesContent({ searchParams }: { searchParams: Promise<{ pillar?: string }> }) {
  const items = await getAllResources();
  const { pillar } = await searchParams;
  const activePillar = pillar && PILLAR_IDS.includes(pillar as HolisticPillar) ? (pillar as HolisticPillar) : undefined;
  const filteredItems = activePillar ? items.filter((item) => item.pillars?.includes(activePillar)) : items;
  const tips = filteredItems.filter((i) => i.type === 'tip');
  const tools = filteredItems.filter((i) => i.type === 'tool');
  const audio = filteredItems.filter((i) => i.type === 'audio');
  const books = filteredItems.filter((i) => i.type === 'book');
  const studies = filteredItems.filter((i) => i.type === 'study');

  return (
    <>
      <SectionHeading title="Resources" eyebrow="Practical & Studies" />
      <PillarFilters active={activePillar} className="mb-6" />
      {filteredItems.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Nothing published for this pillar yet—new field notes are on the way.
        </p>
      )}
      <section>
        <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-400">Practical tips</h3>
        {tips.length === 0 && <p className="text-sm text-neutral-500">Coming soon.</p>}
        {tips.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((t) => (
              <li key={t.slug} className="flex flex-col h-full p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-serif text-xl font-medium text-neutral-900 dark:text-neutral-100">{t.title}</h4>
                  {t.tags[0] && (
                    <span className="text-[10px] uppercase font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                      {t.tags[0]}
                    </span>
                  )}
                </div>
                {t.excerpt && <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 flex-grow">{t.excerpt}</p>}

                {t.pillars && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {t.pillars.slice(0, 3).map((pillar) => (
                      <PillarBadge key={pillar} pillar={pillar} href={`/resources?pillar=${pillar}`} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-400">Tools & Templates</h3>
        {tools.length === 0 && <p className="text-sm text-neutral-500">Coming soon.</p>}
        {tools.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((t) => (
              <li key={t.slug} className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-900 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-lg font-medium text-neutral-900 dark:text-neutral-100">{t.title}</h4>
                  <span className="text-[10px] uppercase font-mono text-neutral-400 bg-white dark:bg-neutral-800 px-2 py-1 rounded-full border border-neutral-100 dark:border-neutral-700">PDF</span>
                </div>
                {t.excerpt && <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">{t.excerpt}</p>}
                {t.pillars && (
                  <div className="flex flex-wrap gap-2">
                    {t.pillars.map((pillar) => (
                      <PillarBadge key={pillar} pillar={pillar} href={`/resources?pillar=${pillar}`} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-400">Audio Sessions</h3>
        {audio.length === 0 && <p className="text-sm text-neutral-500">Coming soon.</p>}
        {audio.length > 0 && (
          <div className="relative w-full">
            <ScrollStack useWindowScroll={true} itemDistance={40} itemStackDistance={15}>
              {audio.map((a) => (
                <ScrollStackItem key={a.slug} itemClassName="bg-neutral-900 text-white rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-neutral-900/50" />
                  <div className="relative p-8 flex flex-col h-full justify-between z-10">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-primary-300 uppercase tracking-widest">Audio</span>
                        <span className="text-xs font-mono text-neutral-400">{a.tags[0]}</span>
                      </div>
                      <h4 className="text-3xl font-serif font-medium mb-4">{a.title}</h4>
                      {a.excerpt && <p className="text-neutral-300 max-w-xl">{a.excerpt}</p>}
                    </div>
                    <div className="flex items-center gap-3 mt-8">
                      <div className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Listen Now</span>
                    </div>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-400">Studies & Syntheses</h3>
        {studies.length === 0 && <p className="text-sm text-neutral-500">Coming soon.</p>}
        <ul className="space-y-4">
          {studies.map((s) => (
            <li key={s.slug} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <h4 className="font-medium mb-1">{s.title}</h4>
              {s.excerpt && <p className="text-xs text-neutral-600 dark:text-neutral-400">{s.excerpt}</p>}
              <p className="mt-2 text-[10px] uppercase tracking-wide text-neutral-500">{s.tags.join(' · ')}</p>
              {s.pillars && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.pillars.map((pillar) => (
                    <PillarBadge key={pillar} pillar={pillar} href={`/resources?pillar=${pillar}`} />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase text-primary-600 dark:text-primary-400">Recommended Books</h3>
        {books.length === 0 && <p className="text-sm text-neutral-500">Coming soon.</p>}
        {books.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {books.map((b) => (
              <li key={b.slug} className="group cursor-pointer">
                <div className="aspect-[2/3] bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden">
                  {/* Placeholder for book cover */}
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-400 dark:text-neutral-600 font-serif text-4xl opacity-20 italic">
                    Book
                  </div>
                </div>
                <h4 className="font-serif font-medium text-neutral-900 dark:text-neutral-100 leading-tight mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{b.title}</h4>
                {b.excerpt && <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{b.excerpt}</p>}
                {b.pillars && (
                  <div className="flex flex-wrap gap-1">
                    {b.pillars.slice(0, 1).map((p) => (
                      <span key={p} className="text-[10px] uppercase tracking-wide text-neutral-400">{p}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function ResourcesPage({ searchParams }: { searchParams: Promise<{ pillar?: string }> }) {
  return (
    <div className="site-container space-y-16">
      <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-white/5 rounded-3xl" />}>
        <ResourcesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
