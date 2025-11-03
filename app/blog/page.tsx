import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PillarBadge } from '@/components/ui/PillarBadge';
import { PillarFilters } from '@/components/ui/PillarFilters';
import type { HolisticPillar } from '@/lib/types';
import { PILLAR_IDS } from '@/lib/pillars';
import { formatDateLabel } from '@/lib/utils/formatDate';

export const dynamic = 'force-static';

export default async function BlogIndex({ searchParams }: { searchParams?: { pillar?: string } }) {
  const posts = await getAllPosts();
  const pillarParam = searchParams?.pillar;
  const activePillar = pillarParam && PILLAR_IDS.includes(pillarParam as HolisticPillar) ? (pillarParam as HolisticPillar) : undefined;
  const filteredPosts = activePillar ? posts.filter((post) => post.pillars?.includes(activePillar)) : posts;
  return (
    <div>
      <SectionHeading title="Articles & Analysis" eyebrow="Blog" />
      <PillarFilters active={activePillar} className="mb-6" />
      {activePillar && filteredPosts.length === 0 && (
        <p className="mb-8 text-sm text-neutral-500 dark:text-neutral-400">
          No articles yet for this pillar—check back soon or explore another focus area.
        </p>
      )}
      {filteredPosts.length === 0 && posts.length === 0 && <p className="text-sm text-neutral-500">No posts yet.</p>}
      {filteredPosts.length > 0 && (
        <p className="mb-6 text-xs text-neutral-500 dark:text-neutral-400">French originals shown while English translations are prepared.</p>
      )}
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {filteredPosts.map((p) => (
          <li key={p.slug} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 hover:shadow-sm transition-shadow">
            <Link href={`/blog/${p.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-md">
              <h2 className="text-xl font-semibold tracking-tight mb-1">{p.title}</h2>
              <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-500 mb-2">{formatDateLabel(p.date)}</p>
              {p.excerpt && <p className="text-neutral-700 dark:text-neutral-300 text-sm line-clamp-3">{p.excerpt}</p>}
              {p.pillars && p.pillars.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.pillars.map((pillar) => (
                    <PillarBadge key={pillar} pillar={pillar} />
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
