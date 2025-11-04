import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { listFormations } from '@/lib/server/formations';
import type { FormationStatus, HolisticPillar } from '@/lib/types';
import { PillarFilters } from '@/components/ui/PillarFilters';
import { PILLAR_IDS } from '@/lib/pillars';

const statusLabel: Record<FormationStatus, string> = {
  soon: 'Soon',
  prelaunch: 'Prelaunch',
  available: 'Available'
};

export const dynamic = 'force-dynamic';

export default async function CoursesIndex({ searchParams }: { searchParams?: { pillar?: string } }) {
  const formations = await listFormations();
  const pillarParam = searchParams?.pillar;
  const activePillar =
    pillarParam && PILLAR_IDS.includes(pillarParam as HolisticPillar) ? (pillarParam as HolisticPillar) : undefined;
  const filteredFormations = activePillar ? formations.filter((f) => f.pillars?.includes(activePillar)) : formations;

  return (
    <div>
      <SectionHeading title="Courses" eyebrow="Programs" />
      <PillarFilters active={activePillar} className="mb-6" />
      {activePillar && filteredFormations.length === 0 && (
        <p className="mb-8 text-sm text-neutral-500 dark:text-neutral-400">
          No courses published for this pillar yet—new cohorts are in the works.
        </p>
      )}
      {filteredFormations.length === 0 && formations.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No courses available yet.</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        {filteredFormations.map((f) => (
          <Link key={f.slug} href={`/courses/${f.slug}`}>
            <Card
              title={f.title}
              description={f.short}
              pillars={f.pillars}
              footer={
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <span className="text-[11px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                    {statusLabel[f.status]}
                  </span>
                  <span>{f.outline?.length ?? 0} modules</span>
                </div>
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
