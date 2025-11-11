import type { Metadata } from 'next';
import Link from 'next/link';
import type { HolisticPillar } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { HolisticMap } from '@/components/sections/HolisticMap';
import { CheckoutButton } from '@/components/ui/CheckoutButton';

interface ShowcaseItem {
  title: string;
  description: string;
  href: string;
  badge: string;
  pillars: HolisticPillar[];
}

interface ShowcaseVideo extends ShowcaseItem {}

const placeholderArticles: ShowcaseItem[] = [
  { title: 'Understanding parental stress in the AI era', description: 'Neuroscience basics + how AI can support instead of overload.', href: '/blog', badge: 'Article', pillars: ['work', 'ai-tools'] },
  { title: '3 micro-habits to reduce cognitive overload', description: 'Tiny 2-minute routines you can embed in a chaotic day.', href: '/blog', badge: 'Tip', pillars: ['mind-body', 'analog-tools'] },
  { title: 'Why your brain tires with too many apps', description: 'Cognitive analysis + digital hygiene strategies.', href: '/blog', badge: 'Insight', pillars: ['work', 'sleep'] }
];

const placeholderCourses: ShowcaseItem[] = [
  { title: 'Starter: AI & Family Calm', description: 'Lay the foundations: understand, filter and use AI without stress.', href: '/courses', badge: 'Soon', pillars: ['ai-tools', 'mind-body'] },
  { title: 'Anti-Overload Routine (4 weeks)', description: 'Guided protocols + automation templates adapted to real life.', href: '/courses', badge: 'Prelaunch', pillars: ['work', 'sleep'] },
  { title: 'Focus & Attention Workshop', description: 'Practical techniques to reduce cognitive fragmentation from notifications.', href: '/courses', badge: 'Live', pillars: ['mind-body', 'analog-tools'] }
];

const placeholderVideos: ShowcaseVideo[] = [
  { title: 'How AI can calm (not agitate) your day', description: 'Intro video on good usage patterns.', href: '/videos', badge: 'Video', pillars: ['ai-tools'] },
  { title: 'Batching family tasks with prompts', description: 'Concrete demo.', href: '/videos', badge: 'Workshop', pillars: ['work', 'ai-tools'] },
  { title: 'Limiting doomscrolling with scripts', description: 'Examples of digital guardrails.', href: '/videos', badge: 'Guide', pillars: ['analog-tools', 'mind-body'] }
];

export const metadata: Metadata = {
  title: 'Home',
  description: 'Training, tools and micro-routines to reduce mental load and use AI as leverage for family life.'
};

export default function HomePage() {
  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-[32px] border border-neutral-100 bg-gradient-to-br from-neutral-25 via-white to-primary-50/70 p-10 shadow-[0_45px_90px_-70px_rgba(39,58,54,0.55)] dark:border-neutral-800/60 dark:from-neutral-900 dark:via-neutral-900/80 dark:to-primary-900/40 md:p-16">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-100/70 bg-white/70 px-4 py-1 text-xs font-medium text-primary-600 shadow-sm backdrop-blur dark:border-primary-700/40 dark:bg-primary-900/30 dark:text-primary-200">
            <span>New platform</span>
            <span className="text-neutral-500 dark:text-neutral-300">Parents · AI · Calm systems</span>
          </div>
          <h1 className="font-serif text-4xl leading-snug text-neutral-700 dark:text-neutral-50 md:text-5xl">
            Reduce mental load.
            <br />
            Use AI as leverage, not noise.
          </h1>
          <p className="max-w-xl text-lg text-neutral-600 dark:text-neutral-300">
            Training, tools and micro-routines to transform your family day without adding another layer of digital stress.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/courses">
              <Button size="lg">Browse courses</Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg">
                Explore content
              </Button>
            </Link>
          </div>
          <ul className="flex flex-wrap gap-5 pt-4 text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
            <li>Evidence-based</li>
            <li>Human pace</li>
            <li>Measured impact</li>
          </ul>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(95,144,139,0.22),transparent_65%),radial-gradient(circle_at_82%_70%,rgba(149,114,87,0.18),transparent_60%)]" />
      </section>
      <HolisticMap />

      <section>
        <SectionHeading title="Latest content" eyebrow="Blog & Resources" action={<Link href="/blog" className="text-sm font-medium text-primary-600 hover:underline">View all →</Link>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderArticles.map((a) => (
            <Card
              key={a.title}
              title={a.title}
              description={a.description}
              href={a.href}
              badge={a.badge}
              pillars={a.pillars}
              footer={<span>~4 min read</span>}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Courses" eyebrow="Programs" action={<Link href="/courses" className="text-sm font-medium text-primary-600 hover:underline">See courses →</Link>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderCourses.map((c) => (
            <Card
              key={c.title}
              title={c.title}
              description={c.description}
              href={c.href}
              badge={c.badge}
              pillars={c.pillars}
              footer={<span>Details soon</span>}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Videos" eyebrow="Replays & Demos" action={<Link href="/videos" className="text-sm font-medium text-primary-600 hover:underline">More →</Link>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderVideos.map((v) => (
            <Card
              key={v.title}
              title={v.title}
              description={v.description}
              href={v.href}
              badge={v.badge}
              pillars={v.pillars}
              footer={<span>5–12 min</span>}
            />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-neutral-100 bg-neutral-25 p-10 dark:border-neutral-800/60 dark:bg-neutral-900 md:p-14">
        <div className="relative z-10 max-w-xl space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-200/50 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-600 dark:border-primary-700/40 dark:bg-primary-900/30 dark:text-primary-200">
            Weekly memo · €0.99
          </p>
          <h2 className="font-serif text-2xl font-semibold text-neutral-700 dark:text-neutral-50">One email per week. Zero noise.</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            1 actionable insight + 1 useful prompt + 1 micro reflection on cognitive hygiene. Subscribe separately for €0.99 whenever
            you want the distilled briefing.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CheckoutButton plan="newsletter" size="lg">
              Join the memo (€0.99)
            </CheckoutButton>
            <Link href="/pro" className="text-sm font-semibold text-primary-600 hover:underline">
              Compare plans →
            </Link>
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">Launch pricing · Cancel anytime</p>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(95,144,139,0.18),transparent_65%),radial-gradient(circle_at_80%_70%,rgba(149,114,87,0.22),transparent_60%)]" />
      </section>
    </div>
  );
}
