'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { cn } from '@/lib/utils/cn';
import type { HolisticPillar } from '@/lib/types';
import { ReactNode } from 'react';
import { ArrowRight, BookOpen, GraduationCap, Video, Sparkles } from 'lucide-react';

export interface ShowcaseItem {
    title: string;
    description: string;
    href: string;
    badge: string;
    pillars: HolisticPillar[];
    footer?: ReactNode;
}

interface ContentGridProps {
    title: string;
    eyebrow: string;
    items: ShowcaseItem[];
    actionLink: {
        href: string;
        label: string;
    };
    variant?: 'blog' | 'courses' | 'videos' | 'default';
}

// Section-specific styling - MORE VISIBLE backgrounds
const sectionStyles = {
    blog: {
        icon: BookOpen,
        // Sage green tones - calming, nature
        bgColor: 'bg-primary-50/80 dark:bg-primary-950/40',
        borderColor: 'border-primary-100 dark:border-primary-900/50',
        accentBg: 'bg-primary-100/60 dark:bg-primary-900/30',
        floatColor1: 'bg-primary-200/50 dark:bg-primary-800/30',
        floatColor2: 'bg-accent-100/40 dark:bg-accent-900/20',
        accentLine: 'bg-primary-500',
        iconBg: 'bg-primary-100 dark:bg-primary-900/50',
    },
    courses: {
        icon: GraduationCap,
        // Warm terracotta/sand tones - supportive, grounding
        bgColor: 'bg-accent-50/80 dark:bg-accent-950/40',
        borderColor: 'border-accent-100 dark:border-accent-900/50',
        accentBg: 'bg-accent-100/60 dark:bg-accent-900/30',
        floatColor1: 'bg-accent-200/50 dark:bg-accent-800/30',
        floatColor2: 'bg-primary-100/40 dark:bg-primary-900/20',
        accentLine: 'bg-accent-500',
        iconBg: 'bg-accent-100 dark:bg-accent-900/50',
    },
    videos: {
        icon: Video,
        // Blended sage and sand - balanced, harmonious
        bgColor: 'bg-gradient-to-br from-primary-50/70 to-accent-50/70 dark:from-primary-950/30 dark:to-accent-950/30',
        borderColor: 'border-neutral-200/80 dark:border-neutral-800/50',
        accentBg: 'bg-neutral-100/50 dark:bg-neutral-900/30',
        floatColor1: 'bg-primary-100/40 dark:bg-primary-900/20',
        floatColor2: 'bg-accent-100/40 dark:bg-accent-900/20',
        accentLine: 'bg-gradient-to-r from-primary-500 to-accent-500',
        iconBg: 'bg-neutral-100 dark:bg-neutral-800',
    },
    default: {
        icon: Sparkles,
        bgColor: 'bg-neutral-50/80 dark:bg-neutral-900/40',
        borderColor: 'border-neutral-200/80 dark:border-neutral-800/50',
        accentBg: 'bg-neutral-100/50 dark:bg-neutral-800/30',
        floatColor1: 'bg-neutral-200/40 dark:bg-neutral-700/20',
        floatColor2: 'bg-neutral-100/40 dark:bg-neutral-800/20',
        accentLine: 'bg-neutral-400',
        iconBg: 'bg-neutral-100 dark:bg-neutral-800',
    },
};

export function ContentGrid({ title, eyebrow, items, actionLink, variant = 'default' }: ContentGridProps) {
    const styles = sectionStyles[variant];
    const Icon = styles.icon;

    return (
        <section className="relative py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {/* Visible section background */}
            <div className={cn(
                "absolute inset-0 rounded-[2.5rem] border",
                styles.bgColor,
                styles.borderColor
            )}>
                {/* Inner accent strip at top */}
                <div className={cn(
                    "absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-b-full",
                    styles.accentLine
                )} />

                {/* Decorative floating shapes - more visible */}
                <div className={cn(
                    "absolute top-16 right-16 w-72 h-72 rounded-full blur-3xl",
                    styles.floatColor1
                )} />
                <div className={cn(
                    "absolute bottom-16 left-16 w-56 h-56 rounded-full blur-3xl",
                    styles.floatColor2
                )} />
                <div className={cn(
                    "absolute top-1/2 left-1/3 w-40 h-40 rounded-full blur-2xl opacity-50",
                    styles.floatColor1
                )} />
            </div>

            <div className="relative z-10">
                {/* Modern section header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                    <div>
                        <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">
                            <div className={cn(
                                "flex items-center justify-center w-9 h-9 rounded-xl shadow-sm",
                                styles.iconBg
                            )}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <span className={cn("w-10 h-0.5 rounded-full", styles.accentLine)} />
                            {eyebrow}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 dark:text-white">
                            {title}
                        </h2>
                    </div>
                    <Link
                        href={actionLink.href}
                        className={cn(
                            "group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                            "text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
                            styles.accentBg,
                            "hover:shadow-md"
                        )}
                    >
                        {actionLink.label}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Bento-style grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((item, i) => (
                        <MotionWrapper
                            key={item.title}
                            delay={i * 0.1}
                            className={cn(
                                "h-full",
                                i === 0 && "md:col-span-2 lg:col-span-2"
                            )}
                        >
                            <Card
                                title={item.title}
                                description={item.description}
                                href={item.href}
                                badge={item.badge}
                                pillars={item.pillars}
                                footer={item.footer}
                                variant={i === 0 ? 'featured' : 'default'}
                            />
                        </MotionWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
