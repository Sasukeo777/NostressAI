"use client";
import React from 'react';
import Link from 'next/link';

interface InteractiveCTAProps {
  slug: string; // interactive slug
}

export function InteractiveCTA({ slug }: InteractiveCTAProps) {
  return (
    <div className="mt-16 mb-12 not-prose">
      <Link
        href={`/interactive/${slug}`}
        className="group block relative overflow-hidden rounded-[2.5rem] border border-primary-200/60 dark:border-primary-700/40 bg-gradient-to-br from-primary-50/80 via-white/50 to-primary-50/80 dark:from-primary-900/20 dark:via-neutral-900/50 dark:to-primary-900/20 p-8 md:p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(var(--primary-500),0.15)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(var(--primary-500),0.1),transparent_50%)] opacity-60 transition-opacity group-hover:opacity-80" />
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-accent-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform duration-500">
            <span className="relative z-10">✦</span>
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-300">
                Interactive Version
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
              Explore this topic in an immersive format
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
              Jump into charts, thematic tabs, and extended data designed to deepen the article.
            </p>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-300">
              <span className="sr-only">Open</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
