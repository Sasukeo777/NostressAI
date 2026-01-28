import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PillarBadge } from '@/components/ui/PillarBadge';
import { getFormationBySlug } from '@/lib/server/formations';
import { Button, buttonVariants } from '@/components/ui/Button';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Course, WithContext } from 'schema-dts';

// export const revalidate = 3600; // Incompatible with cacheComponents
// export const dynamic = 'force-dynamic';

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const formation = await getFormationBySlug(slug);
  if (!formation) return notFound();

  const courseSchema: WithContext<Course> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: formation.title,
    description: formation.short,
    provider: {
      '@type': 'Organization',
      name: 'NoStress AI',
      sameAs: 'https://www.nostress.ai'
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      instructor: {
        '@type': 'Person',
        name: 'NoStress AI Team',
        image: 'https://www.nostress.ai/favicon.svg'
      }
    }
  };

  return (
    <div className="site-container py-12 md:py-20 space-y-8">
      <JsonLd schema={courseSchema} />
      <div>
        <Link href="/courses" className="text-xs text-primary-600 hover:underline">← Back to courses</Link>
        <h1 className="mt-2 text-3xl md:text-4xl font-serif font-medium tracking-tight text-neutral-900 dark:text-white">{formation.title}</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">{formation.short}</p>
        {formation.pillars && (
          <div className="mt-6 flex flex-wrap gap-2">
            {formation.pillars.map((pillar) => (
              <PillarBadge key={pillar} pillar={pillar} />
            ))}
          </div>
        )}
      </div>
      <section className="prose prose-neutral dark:prose-invert max-w-none">
        <h2 className="text-xl font-serif font-medium mb-4">Outline</h2>
        <ol className="list-decimal ml-5 space-y-2 text-base text-neutral-700 dark:text-neutral-300">
          {formation.outline?.map((module) => (
            <li key={module}>{module}</li>
          ))}
        </ol>
      </section>
      {formation.ctaUrl ? (
        <div className="rounded-3xl border border-primary-200 dark:border-primary-700/50 bg-gradient-to-br from-primary-50/60 to-white/50 dark:from-primary-900/10 dark:to-neutral-900/50 p-8 shadow-sm">
          <h3 className="font-serif text-lg font-medium mb-2 text-primary-800 dark:text-primary-200">Ready to start?</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-lg">
            This course is hosted externally. Continue on Udemy to see the full syllabus and enrol.
          </p>
          <a
            href={formation.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-primary-900 px-8 text-sm font-medium tracking-wide text-white shadow-lg shadow-primary-900/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:bg-white dark:text-primary-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
          >
            Open course on Udemy
          </a>
        </div>
      ) : (
        <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 bg-neutral-50 dark:bg-neutral-900">
          <h3 className="font-serif text-lg font-medium mb-2">Interested?</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">Leave your email to be notified when registration opens.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input type="email" placeholder="Your email" className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" />
            <Button type="button" className="rounded-xl">Keep me posted</Button>
          </form>
        </div>
      )}
    </div>
  );
}
