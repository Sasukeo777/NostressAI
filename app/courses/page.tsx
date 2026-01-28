import { listFormations } from '@/lib/server/formations';
import { CourseList } from '@/components/courses/CourseList';
import type { HolisticPillar } from '@/lib/types';
import { PILLAR_IDS } from '@/lib/pillars';
import { Suspense } from 'react';

// export const revalidate = 3600; // Incompatible with cacheComponents
// export const dynamic = 'force-dynamic';

async function CoursesContent({ searchParams }: { searchParams: Promise<{ pillar?: string }> }) {
  const formations = await listFormations();
  const { pillar } = await searchParams;
  const initialPillar =
    pillar && PILLAR_IDS.includes(pillar as HolisticPillar) ? (pillar as HolisticPillar) : undefined;

  return <CourseList initialCourses={formations} initialPillar={initialPillar} />;
}

export default function CoursesIndex({ searchParams }: { searchParams: Promise<{ pillar?: string }> }) {
  return (
    <div className="relative min-h-screen">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[image:var(--nature-glow)] dark:bg-[image:var(--nature-glow-dark)] opacity-30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/20 dark:bg-primary-900/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-200/20 dark:bg-accent-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="site-container relative z-10 py-20 space-y-12">
        {/* Hero Section */}
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-300">
            Academy
          </span>
          <h1 className="font-serif text-4xl font-medium text-neutral-900 dark:text-white sm:text-5xl">
            Master the art of <br />
            <span className="text-primary-600 dark:text-primary-400">calm parenting.</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
            Expert-led courses designed to help you navigate the complexities of modern parenthood with confidence and peace of mind.
          </p>
        </div>

        {/* Course List */}
        <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-white/5 rounded-3xl" />}>
          <CoursesContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
