"use client";

import Link from 'next/link';
import { CheckoutButton } from '@/components/ui/CheckoutButton';
import { ArrowRight, Mail } from 'lucide-react';

export function NewsletterSignup() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/50 p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900/50 backdrop-blur-sm">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary-500/10 blur-2xl dark:bg-primary-400/10" />

      <div className="relative z-10">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
          <Mail className="h-5 w-5" />
        </div>

        <h3 className="font-serif text-2xl font-medium tracking-tight text-neutral-900 dark:text-white mb-2">
          Monthly NoStress Newsletter
        </h3>

        <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mb-6 leading-relaxed">
          Highly structured, low-volume digest. <br />
          <strong>5 AI News</strong> + <strong>1 Deep Dive Article</strong> per month. <br />
          <span className="text-sm opacity-80">Included in NoStress+, or available separately.</span>
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <CheckoutButton plan="newsletter" size="lg" className="w-full sm:w-auto">
            Subscribe for $0.99
          </CheckoutButton>
          <Link href="/pro" className="group inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
            Compare plans
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Stripe checkout · cancel anytime
        </p>
      </div>
    </div>
  );
}
