"use client";

import Link from 'next/link';
import { CheckoutButton } from '@/components/ui/CheckoutButton';

export function NewsletterSignup() {
  return (
    <div className="relative">
      <h3 className="font-serif text-2xl font-semibold tracking-tight text-neutral-700 dark:text-neutral-50 mb-3">Weekly calm memo</h3>
      <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-xl mb-6">
        One email per week (€0.99). 1 actionable insight, 1 useful prompt, 1 reflection on cognitive hygiene. Included inside
        NoStress+, or available alone if you just want the memo.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <CheckoutButton plan="newsletter" size="lg">
          Subscribe for €0.99
        </CheckoutButton>
        <Link href="/pro" className="text-sm font-semibold text-primary-600 hover:underline">
          Compare with NoStress+ →
        </Link>
      </div>

      <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
        Stripe checkout · cancel anytime
      </p>
    </div>
  );
}
