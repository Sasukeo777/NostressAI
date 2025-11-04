import { getAllResources } from '@/lib/resources';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PillarBadge } from '@/components/ui/PillarBadge';
import { PillarFilters } from '@/components/ui/PillarFilters';
import type { HolisticPillar } from '@/lib/types';
import { PILLAR_IDS } from '@/lib/pillars';

export const dynamic = 'force-dynamic';

export default async function ResourcesPage({ searchParams }: { searchParams?: { pillar?: string } }) {
  const items = await getAllResources();
  const pillarParam = searchParams?.pillar;
  const activePillar = pillarParam && PILLAR_IDS.includes(pillarParam as HolisticPillar) ? (pillarParam as HolisticPillar) : undefined;
  const filteredItems = activePillar ? items.filter((item) => item.pillars?.includes(activePillar)) : items;
  const tips = filteredItems.filter((i) => i.type === 'tip');
  const studies = filteredItems.filter((i) => i.type === 'study');
  return (
    <div className="space-y-16">
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
        <ul className="space-y-4">
          {tips.map((t) => (
            <li key={t.slug} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <h4 className="font-medium mb-1">{t.title}</h4>
              {t.excerpt && <p className="text-xs text-neutral-600 dark:text-neutral-400">{t.excerpt}</p>}
              <p className="mt-2 text-[10px] uppercase tracking-wide text-neutral-500">{t.tags.join(' · ')}</p>
              {t.pillars && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.pillars.map((pillar) => (
                    <PillarBadge key={pillar} pillar={pillar} href={`/resources?pillar=${pillar}`} />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
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
    </div>
  );
}
