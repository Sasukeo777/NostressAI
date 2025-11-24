"use client";
import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

interface ArticleShellProps {
  children: React.ReactNode;
  toc?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export function ArticleShell({ children, toc, breadcrumb, className }: ArticleShellProps) {
  const [readingWide, setReadingWide] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Animate sections as they appear
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll('[data-fade-section]')) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('fade-in-visible');
            observer.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={clsx('relative site-container', className)} ref={containerRef}>
      <div className="flex gap-10">
        <main className="flex-1">
          {breadcrumb && <div className="mb-6 text-sm text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">{breadcrumb}</div>}
          <div
            className={clsx(
              'relative mx-auto w-full transition-[max-width] duration-300 ease-out',
              readingWide ? 'max-w-[1100px]' : 'max-w-[860px] xl:max-w-[920px]'
            )}
          >
            <button
              type="button"
              onClick={() => setReadingWide((v) => !v)}
              className="group absolute -top-14 right-0 inline-flex items-center gap-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 backdrop-blur px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-pressed={readingWide}
            >
              {readingWide ? 'Standard width' : 'Reading width'}
            </button>
            {children}
          </div>
        </main>
        {toc && (
          <aside className="hidden lg:block w-56 shrink-0 pt-4">
            <div className="sticky top-28 space-y-4">
              {toc}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
