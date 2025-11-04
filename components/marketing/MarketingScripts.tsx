'use client';

import { useEffect } from 'react';

import { useConsent } from '@/components/legal/ConsentProvider';

const MARKETING_SCRIPT_URL = process.env.NEXT_PUBLIC_MARKETING_SCRIPT_URL;
const MARKETING_SCRIPT_ID = 'nostress-marketing-script';

export function MarketingScripts() {
  const { consent, ready } = useConsent();

  useEffect(() => {
    if (!ready) return;

    const existing = document.getElementById(MARKETING_SCRIPT_ID);

    if (!consent.marketing || !MARKETING_SCRIPT_URL) {
      if (existing) {
        existing.remove();
      }
      return;
    }

    if (existing) {
      return;
    }

    const script = document.createElement('script');
    script.id = MARKETING_SCRIPT_ID;
    script.src = MARKETING_SCRIPT_URL;
    script.async = true;
    script.dataset.consent = 'marketing';
    document.head.appendChild(script);
  }, [ready, consent.marketing]);

  return null;
}
