'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { cn } from '@/lib/utils/cn';
import type { HolisticPillar } from '@/lib/types';
import { ReactNode } from 'react';

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
            <SectionHeading
                title={title}
                eyebrow={eyebrow}
                action={
                    <Link href={actionLink.href} className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400">
                        {actionLink.label}
                    </Link>
                }
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
                {items.map((item, i) => (
                    <MotionWrapper
                        key={item.title}
                        delay={i * 0.1}
                        className={cn(
                            "h-full",
                            i === 0 ? "md:col-span-2 md:row-span-1" : "md:col-span-1"
                        )}
                    >
                        <Card
                            title={item.title}
                            description={item.description}
                            href={item.href}
                            badge={item.badge}
                            pillars={item.pillars}
                            footer={item.footer}
                            className={cn(
                                i === 0 && "bg-[image:var(--nature-glow)] dark:bg-[image:var(--nature-glow-dark)]"
                            )}
                        />
                    </MotionWrapper>
                ))}
            </div>
        </section>
    );
}
