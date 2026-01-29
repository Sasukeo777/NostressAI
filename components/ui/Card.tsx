'use client';

import { ReactNode, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, BookOpen, GraduationCap, Video, Lightbulb, Sparkles } from 'lucide-react';
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
  variant?: 'default' | 'featured' | 'compact';
}

// Map badge types to icons
const badgeIcons: Record<string, typeof BookOpen> = {
  'Article': BookOpen,
  'Tip': Lightbulb,
  'Insight': Sparkles,
  'Soon': GraduationCap,
  'Prelaunch': GraduationCap,
  'Live': GraduationCap,
  'Video': Video,
  'Workshop': Video,
  'Guide': Video,
};

export function Card({ title, description, href, badge, footer, className, pillars, variant = 'default' }: CardProps) {
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

  const rotateX = useTransform(mouseY, [-300, 300], [3, -3]);
  const rotateY = useTransform(mouseX, [-300, 300], [-3, 3]);

  const Icon = badge ? badgeIcons[badge] || Sparkles : Sparkles;
  const isFeatured = variant === 'featured';

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
        'group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300',
        // Warm visible styling - cream instead of white
        'bg-neutral-25 dark:bg-neutral-900',
        'border border-neutral-200/60 dark:border-neutral-800',
        'shadow-sm hover:shadow-xl hover:shadow-accent-200/30 dark:hover:shadow-black/30',
        'hover:-translate-y-1 hover:border-primary-200 dark:hover:border-primary-800',
        className
      )}
    >
      {/* Decorative gradient accent */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        isFeatured
          ? "from-primary-500 via-accent-500 to-primary-500 opacity-100"
          : "from-primary-400 to-accent-400"
      )} />

      {/* Animated background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-accent-50/0 group-hover:from-primary-50/50 group-hover:to-accent-50/30 dark:group-hover:from-primary-950/30 dark:group-hover:to-accent-950/20 transition-all duration-500" />

      {/* Content */}
      <div style={{ transform: "translateZ(20px)" }} className="relative flex-1 p-6">
        {/* Badge with icon */}
        {badge && (
          <div className="flex items-center gap-2 mb-4">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-xl",
              isFeatured
                ? "bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25"
                : "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
            )}>
              <Icon className="h-4 w-4" />
            </div>
            <span className={cn(
              "text-[11px] font-bold uppercase tracking-widest",
              isFeatured
                ? "text-primary-600 dark:text-primary-400"
                : "text-neutral-500 dark:text-neutral-500"
            )}>
              {badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className={cn(
          "font-serif font-medium leading-snug transition-colors",
          isFeatured
            ? "text-2xl md:text-3xl text-neutral-900 dark:text-white mb-4"
            : "text-xl text-neutral-800 dark:text-neutral-100 mb-3",
          "group-hover:text-primary-700 dark:group-hover:text-primary-300"
        )}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className={cn(
            "leading-relaxed text-neutral-600 dark:text-neutral-400",
            isFeatured ? "text-base" : "text-sm"
          )}>
            {description}
          </p>
        )}

        {/* Pillars */}
        {pillars && pillars.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {pillars.map((pillar) => (
              <PillarBadge key={pillar} pillar={pillar} size="sm" />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div
          style={{ transform: "translateZ(10px)" }}
          className="relative px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between"
        >
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {footer}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <span>Read more</span>
            <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      )}

      {/* Corner arrow indicator */}
      {!footer && href && (
        <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
          <ArrowUpRight className="h-4 w-4" />
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
