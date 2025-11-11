'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import type { HolisticPillar } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { PillarBadge } from '@/components/ui/PillarBadge';

interface CardProps {
  title: string;
  description?: string;
  href?: string;
  badge?: string;
  footer?: ReactNode;
  className?: string;
  pillars?: HolisticPillar[];
}

export function Card({ title, description, href, badge, footer, className, pillars }: CardProps) {
  const content = (
    <div
      className={cn(
        'group accent-panel relative flex h-full flex-col rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1',
        className
      )}
    >
      <div className="flex-1">
        {badge && (
          <span className="mb-4 inline-block rounded-full bg-primary-50 px-3 py-1 text-[11px] font-medium tracking-wide text-primary-700 dark:bg-primary-800/40 dark:text-primary-200">
            {badge}
          </span>
        )}
        <h3 className="mb-2 text-[1.05rem] font-semibold leading-snug text-neutral-700 transition-colors group-hover:text-primary-600 dark:text-neutral-100">
          {title}
        </h3>
        {description && <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>}
        {pillars && pillars.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {pillars.map((pillar) => (
              <PillarBadge key={pillar} pillar={pillar} size="sm" />
            ))}
          </div>
        )}
      </div>
      {footer && (
        <div className="mt-5 border-t border-neutral-100/70 pt-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          {footer}
        </div>
      )}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
