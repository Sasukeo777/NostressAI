"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button, type ButtonProps } from '@/components/ui/Button';

type PlanType = 'newsletter' | 'plus' | 'lifetime';

interface CheckoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  plan: PlanType;
  successUrl?: string;
  cancelUrl?: string;
}

export function CheckoutButton({ plan, children, successUrl, cancelUrl, ...props }: CheckoutButtonProps) {
  const [pending, setPending] = useState(false);
  const pathname = usePathname();

  const resolveUrl = (value?: string) => {
    if (!value) return undefined;
    if (/^https?:\/\//i.test(value)) return value;
    if (typeof window === 'undefined') return value;
    return new URL(value, window.location.origin).toString();
  };

  return (
    <Button
      type="button"
      disabled={pending}
      onClick={async () => {
        try {
          setPending(true);
          const currentUrl = typeof window !== 'undefined' ? window.location.href : undefined;
          const response = await fetch('/api/billing/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              plan,
              successUrl: resolveUrl(successUrl),
              cancelUrl: resolveUrl(cancelUrl ?? currentUrl)
            })
          });
          if (response.status === 401) {
            window.location.href = `/login?next=${encodeURIComponent(pathname)}`;
            return;
          }
          const data = await response.json();
          if (response.ok && data?.url) {
            window.location.href = data.url;
          } else {
            throw new Error(data?.error || 'Unable to start checkout.');
          }
        } catch (error) {
          console.error('[checkout] failed', error);
          alert('Unable to open Stripe checkout. Please try again or contact support.');
        } finally {
          setPending(false);
        }
      }}
      {...props}
    >
      {pending ? 'Opening Stripe…' : children}
    </Button>
  );
}
