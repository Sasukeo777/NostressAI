import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/sections/Hero';
import { ContentGrid, ShowcaseItem } from '@/components/sections/ContentGrid';
import { CheckoutButton } from '@/components/ui/CheckoutButton';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { Timeline } from '@/components/ui/Timeline';
import { PillarBadge } from '@/components/ui/PillarBadge';

const placeholderArticles: ShowcaseItem[] = [
  { title: 'Understanding parental stress in the AI era', description: 'Neuroscience basics + how AI can support instead of overload.', href: '/blog', badge: 'Article', pillars: ['work', 'ai-tools'], footer: <span>~4 min read</span> },
  { title: '3 micro-habits to reduce cognitive overload', description: 'Tiny 2-minute routines you can embed in a chaotic day.', href: '/blog', badge: 'Tip', pillars: ['mind-body', 'analog-tools'], footer: <span>~2 min read</span> },
  { title: 'Why your brain tires with too many apps', description: 'Cognitive analysis + digital hygiene strategies.', href: '/blog', badge: 'Insight', pillars: ['work', 'sleep'], footer: <span>~5 min read</span> }
];

const placeholderCourses: ShowcaseItem[] = [
  { title: 'Starter: AI & Family Calm', description: 'Lay the foundations: understand, filter and use AI without stress.', href: '/courses', badge: 'Soon', pillars: ['ai-tools', 'mind-body'], footer: <span>Details soon</span> },
  { title: 'Anti-Overload Routine (4 weeks)', description: 'Guided protocols + automation templates adapted to real life.', href: '/courses', badge: 'Prelaunch', pillars: ['work', 'sleep'], footer: <span>Details soon</span> },
  { title: 'Focus & Attention Workshop', description: 'Practical techniques to reduce cognitive fragmentation from notifications.', href: '/courses', badge: 'Live', pillars: ['mind-body', 'analog-tools'], footer: <span>Details soon</span> }
];

const placeholderVideos: ShowcaseItem[] = [
  { title: 'How AI can calm (not agitate) your day', description: 'Intro video on good usage patterns.', href: '/videos', badge: 'Video', pillars: ['ai-tools'], footer: <span>5–12 min</span> },
  { title: 'Batching family tasks with prompts', description: 'Concrete demo.', href: '/videos', badge: 'Workshop', pillars: ['work', 'ai-tools'], footer: <span>5–12 min</span> },
  { title: 'Limiting doomscrolling with scripts', description: 'Examples of digital guardrails.', href: '/videos', badge: 'Guide', pillars: ['analog-tools', 'mind-body'], footer: <span>5–12 min</span> }
];

const timelineData = [
  {
    title: "Regulate the body",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Energy, sleep, and somatic resets that stabilise the nervous system. You can&apos;t build a calm system on a fried nervous system.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <PillarBadge pillar="nutrition" size="sm" className="mb-2" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Fueling for cognitive endurance.</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <PillarBadge pillar="sleep" size="sm" className="mb-2" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Recovery as a non-negotiable.</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <PillarBadge pillar="mind-body" size="sm" className="mb-2" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Somatic tools for instant calm.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Refine the systems",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Design workflows, AI guardrails, and tactile buffers that remove friction. Stop relying on willpower; start relying on systems.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <PillarBadge pillar="work" size="sm" className="mb-2" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Deep work & flow states.</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <PillarBadge pillar="ai-tools" size="sm" className="mb-2" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">AI as a cognitive exoskeleton.</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <PillarBadge pillar="analog-tools" size="sm" className="mb-2" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Paper & pen for clarity.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Expand the horizon",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Learning, context, and purpose so small routines ladder up to meaning. This is where the time you saved goes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <PillarBadge pillar="neuroplasticity" size="sm" className="mb-2" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Rewiring for resilience.</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <PillarBadge pillar="societal-impact" size="sm" className="mb-2" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Parenting in the AI age.</p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <PillarBadge pillar="purpose" size="sm" className="mb-2" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Aligning actions with values.</p>
          </div>
        </div>
      </div>
    ),
  },
];

export const metadata: Metadata = {
  title: 'Home',
  description: 'Training, tools and micro-routines to reduce mental load and use AI as leverage for family life.'
};

export default function HomePage() {
  return (
    <div className="pb-20">
      <div className="px-4 md:px-6 mb-32 pt-12 md:pt-16">
        <Hero />
      </div>

      <div className="site-container space-y-32">


        <Timeline data={timelineData} />

        <ContentGrid
          title="Latest content"
          eyebrow="Blog & Resources"
          items={placeholderArticles}
          actionLink={{ href: '/blog', label: 'View all →' }}
        />

        <ContentGrid
          title="Courses"
          eyebrow="Programs"
          items={placeholderCourses}
          actionLink={{ href: '/courses', label: 'See courses →' }}
        />

        <ContentGrid
          title="Videos"
          eyebrow="Replays & Demos"
          items={placeholderVideos}
          actionLink={{ href: '/videos', label: 'More →' }}
        />

        <MotionWrapper variant="scale">
          <section className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-neutral-900 p-12 text-neutral-900 dark:text-white shadow-2xl shadow-neutral-200/50 dark:shadow-neutral-900/20 md:p-20 border border-neutral-100 dark:border-neutral-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-50 via-white to-neutral-100 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950" />
            <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary-900/20 blur-[100px]" />

            <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-200 backdrop-blur-sm">
                  Monthly Newsletter · $0.99
                </div>
                <h2 className="font-serif text-4xl font-medium leading-tight md:text-5xl">
                  One email per month. <br />
                  <span className="text-primary-600 dark:text-primary-300">Zero noise.</span>
                </h2>
                <p className="max-w-md text-lg text-neutral-600 dark:text-neutral-400">
                  Highly structured, low-volume digest featuring <strong>The 5 AI News You Need to Know</strong> + a <strong>Monthly Nostress Article</strong>. Subscribe separately for $0.99 whenever you want the distilled briefing.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <CheckoutButton plan="newsletter" size="lg" className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
                    Join the newsletter ($0.99)
                  </CheckoutButton>
                  <Link href="/pro" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:underline">
                    Compare plans →
                  </Link>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-neutral-500">Launch pricing · Cancel anytime</p>
              </div>

              <div className="relative hidden lg:block">
                {/* Abstract visual for the newsletter */}
                <div className="aspect-square w-full max-w-md rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm p-8">
                  <div className="h-full w-full rounded-xl border border-neutral-200 dark:border-white/5 bg-white/50 dark:bg-neutral-900/50 p-6">
                    <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-white/10 mb-8" />
                    <div className="space-y-3">
                      <div className="h-2 w-full rounded bg-neutral-200 dark:bg-white/5" />
                      <div className="h-2 w-5/6 rounded bg-neutral-200 dark:bg-white/5" />
                      <div className="h-2 w-4/6 rounded bg-neutral-200 dark:bg-white/5" />
                    </div>
                    <div className="mt-8 space-y-3">
                      <div className="h-2 w-full rounded bg-neutral-200 dark:bg-white/5" />
                      <div className="h-2 w-11/12 rounded bg-neutral-200 dark:bg-white/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </MotionWrapper>
      </div>
    </div>
  );
}

