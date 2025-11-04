'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ConsentPreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = 'nostress-consent-v1';
const defaultPreferences: ConsentPreferences = {
  essential: true,
  analytics: false,
  marketing: false
};

type ConsentContextValue = {
  ready: boolean;
  consent: ConsentPreferences;
  bannerVisible: boolean;
  managerOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  openManager: () => void;
  closeManager: () => void;
  saveConsent: (prefs: ConsentPreferences) => void;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

function parseStoredConsent(value: string | null): ConsentPreferences | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object' && parsed.preferences) {
      const prefs = parsed.preferences as Record<string, unknown>;
      return {
        essential: true,
        analytics: Boolean(prefs.analytics),
        marketing: Boolean(prefs.marketing)
      };
    }
  } catch (error) {
    console.warn('[consent] Unable to parse stored preferences', error);
  }
  return null;
}

function persistConsent(preferences: ConsentPreferences) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        preferences,
        updatedAt: new Date().toISOString()
      })
    );
    window.dispatchEvent(new CustomEvent('nostress-consent-changed', { detail: preferences }));
  } catch (error) {
    console.warn('[consent] Unable to persist preferences', error);
  }
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentPreferences>(defaultPreferences);
  const [ready, setReady] = useState(false);
  const [hasStoredConsent, setHasStoredConsent] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = parseStoredConsent(window.localStorage.getItem(STORAGE_KEY));
    if (stored) {
      setConsent(stored);
      setHasStoredConsent(true);
    }
    setReady(true);
  }, []);

  const applyConsent = (preferences: ConsentPreferences) => {
    setConsent(preferences);
    setHasStoredConsent(true);
    setManagerOpen(false);
    persistConsent(preferences);
  };

  const acceptAll = () => {
    applyConsent({ essential: true, analytics: true, marketing: true });
  };

  const rejectAll = () => {
    applyConsent({ essential: true, analytics: false, marketing: false });
  };

  const saveConsent = (prefs: ConsentPreferences) => {
    applyConsent({ ...prefs, essential: true });
  };

  const bannerVisible = ready && !hasStoredConsent && !managerOpen;

  const contextValue: ConsentContextValue = {
    ready,
    consent,
    bannerVisible,
    managerOpen,
    acceptAll,
    rejectAll,
    openManager: () => setManagerOpen(true),
    closeManager: () => setManagerOpen(false),
    saveConsent
  };

  return <ConsentContext.Provider value={contextValue}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return context;
}
