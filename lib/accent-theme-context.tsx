'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

import type { AccentChoice } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

interface AccentThemeContextValue {
  accent: AccentChoice;
  lightAccent: AccentChoice;
  darkAccent: AccentChoice;
  setAccentTheme: (options: { light?: AccentChoice; dark?: AccentChoice; persist?: boolean }) => void;
}

const AccentThemeContext = createContext<AccentThemeContextValue | undefined>(undefined);
const DEFAULT_ACCENT: AccentChoice = 'classic';
const LIGHT_KEY = 'accent-light';
const DARK_KEY = 'accent-dark';

function getActiveThemeName() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function parseAccent(value: unknown): AccentChoice | null {
  return value === 'classic' || value === 'vivid' ? (value as AccentChoice) : null;
}

export function AccentThemeProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const profileLight = profile?.lightAccent ?? DEFAULT_ACCENT;
  const profileDark = profile?.darkAccent ?? DEFAULT_ACCENT;
  const [lightAccentState, setLightAccentState] = useState<AccentChoice>(profileLight);
  const [darkAccentState, setDarkAccentState] = useState<AccentChoice>(profileDark);
  const [accent, setAccent] = useState<AccentChoice>(profileLight);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedLight = parseAccent(window.localStorage.getItem(LIGHT_KEY));
    const storedDark = parseAccent(window.localStorage.getItem(DARK_KEY));
    setLightAccentState(storedLight ?? profileLight);
    setDarkAccentState(storedDark ?? profileDark);
  }, [profileLight, profileDark]);

  const applyAccent = useCallback(
    (overrides?: { light?: AccentChoice; dark?: AccentChoice }) => {
      if (typeof document === 'undefined') return;
      const light = overrides?.light ?? lightAccentState;
      const dark = overrides?.dark ?? darkAccentState;
      const theme = getActiveThemeName();
      const nextAccent = theme === 'dark' ? dark : light;
      setAccent(nextAccent);
      document.documentElement.dataset.accent = nextAccent;
      try {
        window.localStorage.setItem('accent-active', nextAccent);
      } catch {}
    },
    [darkAccentState, lightAccentState]
  );

  useEffect(() => {
    applyAccent();
  }, [applyAccent]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const observer = new MutationObserver(() => {
      applyAccent();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => observer.disconnect();
  }, [applyAccent]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onStorage = (event: StorageEvent) => {
      if (event.key === LIGHT_KEY) {
        const parsed = parseAccent(event.newValue);
        if (parsed) {
          setLightAccentState(parsed);
        }
      } else if (event.key === DARK_KEY) {
        const parsed = parseAccent(event.newValue);
        if (parsed) {
          setDarkAccentState(parsed);
        }
      } else if (event.key === 'theme') {
        applyAccent();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [applyAccent]);

  const setAccentTheme = useCallback(
    ({ light, dark, persist = true }: { light?: AccentChoice; dark?: AccentChoice; persist?: boolean }) => {
      if (light) {
        setLightAccentState(light);
        if (persist && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(LIGHT_KEY, light);
          } catch {}
        }
      }
      if (dark) {
        setDarkAccentState(dark);
        if (persist && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(DARK_KEY, dark);
          } catch {}
        }
      }
      applyAccent({ light, dark });
    },
    [applyAccent]
  );

  const value = useMemo<AccentThemeContextValue>(
    () => ({
      accent,
      lightAccent: lightAccentState,
      darkAccent: darkAccentState,
      setAccentTheme
    }),
    [accent, darkAccentState, lightAccentState, setAccentTheme]
  );

  return <AccentThemeContext.Provider value={value}>{children}</AccentThemeContext.Provider>;
}

export function useAccentTheme() {
  const context = useContext(AccentThemeContext);
  if (!context) {
    throw new Error('useAccentTheme must be used within AccentThemeProvider');
  }
  return context;
}
