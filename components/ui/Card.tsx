'use client';

import { ReactNode, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        'group relative flex h-full flex-col p-6 rounded-2xl transition-all duration-500',
        'border border-transparent',
        // Explicit hover styles instead of hover:glass-panel
        'hover:backdrop-blur-xl hover:bg-[var(--glass-bg)] hover:shadow-[var(--glass-shadow)]',
        'hover:border-white/40 dark:hover:border-white/10 dark:hover:bg-[var(--glass-bg-dark)] dark:hover:shadow-[var(--glass-shadow-dark)]',
        'hover:-translate-y-1',
        className
      )}
    >
      <div style={{ transform: "translateZ(20px)" }} className="flex-1">
        {badge && (
          <span className="mb-4 inline-block rounded-full bg-primary-100/50 px-3 py-1 text-[11px] font-medium tracking-wide text-primary-800 backdrop-blur-sm dark:bg-primary-900/30 dark:text-primary-200">
            {badge}
          </span>
        )}
        <h3 className="mb-3 text-xl font-serif font-medium leading-snug text-neutral-800 transition-colors group-hover:text-primary-700 dark:text-neutral-100 dark:group-hover:text-primary-300">
          {title}
        </h3>
        {description && <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>}
        {pillars && pillars.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {pillars.map((pillar) => (
              <PillarBadge key={pillar} pillar={pillar} size="sm" />
            ))}
          </div>
        )}
      </div>
      {footer && (
        <div style={{ transform: "translateZ(10px)" }} className="mt-6 border-t border-neutral-200/50 pt-4 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          {footer}
        </div>
      )}
    </motion.div>
  );

  return href ? (
    <Link href={href} className="block h-full [perspective:1000px]">
      {content}
    </Link>
  ) : (
    <div className="h-full [perspective:1000px]">{content}</div>
  );
}
