import type { HolisticPillar } from '@/lib/types';
import { Leaf, Moon, HeartPulse, Workflow, Bot, Palette, BrainCircuit, Globe2, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface PillarDefinition {
  id: HolisticPillar;
  name: string;
  tagline: string;
  description: string;
  accentLight: string;
  accentDark: string;
  icon: LucideIcon;
}

export const HOLISTIC_PILLARS: PillarDefinition[] = [
  {
    id: 'nutrition',
    name: 'Nutrition & Energy',
    tagline: 'Fuel clarity through deliberate nourishment.',
    description:
      'Guides on stabilising blood sugar, micronutrient support, hydration, and caffeine management to keep cognitive load smooth throughout the day.',
    accentLight: 'bg-[#F0EFE8] text-[#6E705F]',
    accentDark: 'dark:bg-[#38372F] dark:text-[#D7D4C3]',
    icon: Leaf
  },
  {
    id: 'work',
    name: 'Work Systems',
    tagline: 'Design workflows that protect focus.',
    description:
      'Protocols for task batching, async rituals, and recovery cadences so the calendar and inbox stop hijacking your nervous system.',
    accentLight: 'bg-[#EAF1F1] text-[#4F7A75]',
    accentDark: 'dark:bg-[#2E3D3A] dark:text-[#A5C0BB]',
    icon: Workflow
  },
  {
    id: 'sleep',
    name: 'Sleep & Recovery',
    tagline: 'Anchor rest to stay antifragile.',
    description:
      'Evening wind-downs, light exposure, sleep debt tracking, and micro-recovery breaks tuned to calm the HPA axis and rebuild reserves.',
    accentLight: 'bg-[#EDEBFA] text-[#5C5A8E]',
    accentDark: 'dark:bg-[#312F49] dark:text-[#C8C5F1]',
    icon: Moon
  },
  {
    id: 'mind-body',
    name: 'Mind & Body',
    tagline: 'Somatic practices to metabolise stress.',
    description:
      'Breathing protocols, posture resets, mindful micro-pauses, and emotional granularity exercises to keep the body and mind aligned.',
    accentLight: 'bg-[#F3ECEF] text-[#84586B]',
    accentDark: 'dark:bg-[#3D2A32] dark:text-[#E3C4CF]',
    icon: HeartPulse
  },
  {
    id: 'ai-tools',
    name: 'AI Support',
    tagline: 'Let assistants carry the admin load.',
    description:
      'Prompt systems, review workflows, and governance principles so AI handles the repetitive tasks while you stay intentional.',
    accentLight: 'bg-[#E9EFF9] text-[#48648C]',
    accentDark: 'dark:bg-[#2B3547] dark:text-[#B7C6E6]',
    icon: Bot
  },
  {
    id: 'analog-tools',
    name: 'Analog Tools',
    tagline: 'Tactile aids to soothe and focus.',
    description:
      'Printable planners, mindful colouring, journaling scripts, and tactile routines that anchor you back into the physical world.',
    accentLight: 'bg-[#F6EFE9] text-[#8A6247]',
    accentDark: 'dark:bg-[#3B2B23] dark:text-[#E3C9B8]',
    icon: Palette
  },
  {
    id: 'neuroplasticity',
    name: 'Neuroplasticity',
    tagline: 'Train the brain to adapt and recover.',
    description:
      'Habits, learning sprints, and mindful rehearsal that reshape neural pathways so stress responses become more flexible and resilient.',
    accentLight: 'bg-[#EEF2FF] text-[#4338CA]',
    accentDark: 'dark:bg-[#312E81] dark:text-[#C7D2FE]',
    icon: BrainCircuit
  },
  {
    id: 'societal-impact',
    name: 'Societal Impact',
    tagline: 'Contextualise stressors in the systems around us.',
    description:
      'Macro-level research on policy, economics, and cultural shifts that influence daily stress loads—because self-care lives within shared structures.',
    accentLight: 'bg-[#E6F4FF] text-[#0F4C81]',
    accentDark: 'dark:bg-[#1E3A5F] dark:text-[#B8D4F6]',
    icon: Globe2
  },
  {
    id: 'purpose',
    name: 'Purpose & Direction',
    tagline: 'Align decisions with what actually matters.',
    description:
      'Frameworks for meaning-making, value audits, and future casting so actions stay connected to a motivating personal narrative.',
    accentLight: 'bg-[#FDF4FF] text-[#86198F]',
    accentDark: 'dark:bg-[#3B0F3F] dark:text-[#F5D0FE]',
    icon: Target
  }
];

export function getPillar(id: HolisticPillar): PillarDefinition | undefined {
  return HOLISTIC_PILLARS.find((pillar) => pillar.id === id);
}

export const PILLAR_IDS: HolisticPillar[] = HOLISTIC_PILLARS.map((pillar) => pillar.id);

// ---------------------------------------------------------------------------
// Meta-Categories (groupings of pillars for simplified UX)
// ---------------------------------------------------------------------------

export type MetaCategoryId = 'body' | 'systems' | 'mindset';

export interface MetaCategory {
  id: MetaCategoryId;
  title: string;
  description: string;
  pillars: HolisticPillar[];
}

export const PILLAR_META_CATEGORIES: MetaCategory[] = [
  {
    id: 'body',
    title: 'Regulate the body',
    description: 'Energy, sleep, and somatic resets that stabilise the nervous system.',
    pillars: ['nutrition', 'sleep', 'mind-body']
  },
  {
    id: 'systems',
    title: 'Refine the systems',
    description: 'Design workflows, AI guardrails, and tactile buffers that remove friction.',
    pillars: ['work', 'ai-tools', 'analog-tools']
  },
  {
    id: 'mindset',
    title: 'Expand the horizon',
    description: 'Learning, context, and purpose so small routines ladder up to meaning.',
    pillars: ['neuroplasticity', 'societal-impact', 'purpose']
  }
];

/**
 * Get the meta-category that contains a given pillar.
 */
export function getMetaCategory(pillarId: HolisticPillar): MetaCategory | undefined {
  return PILLAR_META_CATEGORIES.find((cat) => cat.pillars.includes(pillarId));
}
