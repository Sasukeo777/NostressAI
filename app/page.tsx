import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/sections/Hero';
import { ContentGrid, ShowcaseItem } from '@/components/sections/ContentGrid';
import { CheckoutButton } from '@/components/ui/CheckoutButton';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { Timeline } from '@/components/ui/Timeline';
import { PillarBadge } from '@/components/ui/PillarBadge';
import { NewsletterShowcase } from '@/components/sections/NewsletterShowcase';

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
      <Hero />

      <div className="site-container space-y-32 mt-20">

        <ContentGrid
          title="Latest content"
          eyebrow="Blog & Resources"
          items={placeholderArticles}
          actionLink={{ href: '/blog', label: 'View all' }}
          variant="blog"
        />

        <Timeline data={timelineData} />

        <ContentGrid
          title="Courses"
          eyebrow="Programs"
          items={placeholderCourses}
          actionLink={{ href: '/courses', label: 'See courses' }}
          variant="courses"
        />

        <ContentGrid
          title="Videos"
          eyebrow="Replays & Demos"
          items={placeholderVideos}
          actionLink={{ href: '/videos', label: 'More' }}
          variant="videos"
        />

        <MotionWrapper variant="scale">
          <NewsletterShowcase />
        </MotionWrapper>
      </div>
    </div>
  );
}

