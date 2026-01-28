'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { cn } from '@/lib/utils/cn';
import type { HolisticPillar } from '@/lib/types';
import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

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
}

export function ContentGrid({ title, eyebrow, items, actionLink }: ContentGridProps) {
    return (
        <section>
            {/* Modern section header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <div>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">
                        <span className="w-8 h-px bg-primary-500" />
                        {eyebrow}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 dark:text-white">
                        {title}
                    </h2>
                </div>
                <Link
                    href={actionLink.href}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
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
        </section>
    );
}
