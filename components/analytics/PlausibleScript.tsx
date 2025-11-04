'use client';

import { useEffect } from 'react';

import { useConsent } from '@/components/legal/ConsentProvider';

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_SCRIPT_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT ?? 'https://plausible.io/js/script.js';
const SCRIPT_ID = 'plausible-analytics-script';

declare global {
  interface Window {
    plausible?: (...args: unknown[]) => void;
  }
}

export function PlausibleScript() {
  const { consent, ready } = useConsent();

  useEffect(() => {
    if (!ready) return;

    const existing = document.getElementById(SCRIPT_ID);

    if (!consent.analytics || !PLAUSIBLE_DOMAIN) {
      if (existing) {
        existing.remove();
      }
      if (typeof window !== 'undefined' && window.plausible) {
        delete window.plausible;
      }
      return;
    }

    if (existing) {
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = PLAUSIBLE_SCRIPT_SRC;
    script.defer = true;
    script.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
    script.setAttribute('data-api', `${PLAUSIBLE_SCRIPT_SRC.replace(/\/js\/script(\.js)?$/, '')}/api/event`);
    document.head.appendChild(script);
  }, [ready, consent.analytics]);

  if (!PLAUSIBLE_DOMAIN) {
    return null;
  }

  return null;
}
