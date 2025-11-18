import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PillarBadge } from '@/components/ui/PillarBadge';
import { getFormationBySlug } from '@/lib/server/formations';
import { Button, buttonVariants } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const formation = await getFormationBySlug(params.slug);
  if (!formation) return notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/courses" className="text-xs text-primary-600 hover:underline">← Back to courses</Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{formation.title}</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300 max-w-2xl">{formation.short}</p>
        {formation.pillars && (
          <div className="mt-4 flex flex-wrap gap-2">
            {formation.pillars.map((pillar) => (
              <PillarBadge key={pillar} pillar={pillar} />
            ))}
          </div>
        )}
      </div>
      <section>
        <h2 className="text-lg font-semibold mb-4">Outline</h2>
        <ol className="list-decimal ml-5 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
          {formation.outline?.map((module) => (
            <li key={module}>{module}</li>
          ))}
        </ol>
      </section>
      {formation.ctaUrl ? (
        <div className="rounded-lg border border-primary-200 dark:border-primary-700/50 bg-primary-50/60 dark:bg-primary-900/10 p-6">
          <h3 className="font-medium mb-2 text-primary-700 dark:text-primary-200">Ready to start?</h3>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">
            This course is hosted externally. Continue on Udemy to see the full syllabus and enrol.
          </p>
          <a
            href={formation.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-primary-600 px-6 text-sm font-medium tracking-tight text-white shadow-[0_18px_32px_-20px_rgba(79,122,117,0.8)] transition-colors duration-200 hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-400"
          >
            Open course on Udemy
          </a>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50 dark:bg-neutral-900">
          <h3 className="font-medium mb-2">Interested?</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Leave your email to be notified when registration opens.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input type="email" placeholder="Your email" className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm" />
            <Button type="button">Keep me posted</Button>
          </form>
        </div>
      )}
    </div>
  );
}
