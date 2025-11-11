'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ProfileActionState, updateProfile } from './actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/AvatarFallback';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { PRESET_AVATARS } from '@/lib/profile-presets';
import { useAuth } from '@/lib/auth-context';
import { HOLISTIC_PILLARS } from '@/lib/pillars';
import type { AccentChoice, HolisticPillar } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { useAccentTheme } from '@/lib/accent-theme-context';

interface ProfileFormProps {
  displayName: string | null;
  avatarUrl: string | null;
  email: string;
  role: string | null;
  favoritePillars: HolisticPillar[];
  plan: string | null;
  lightAccent: AccentChoice;
  darkAccent: AccentChoice;
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} className="mt-4 w-full sm:w-auto">
      {pending ? (
        <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving…</span>
      ) : (
        'Save changes'
      )}
    </Button>
  );
}

interface AccentThemeCardProps {
  currentLight: AccentChoice;
  currentDark: AccentChoice;
  onLightChange: (value: AccentChoice) => void;
  onDarkChange: (value: AccentChoice) => void;
}

function AccentThemeCard({ currentLight, currentDark, onLightChange, onDarkChange }: AccentThemeCardProps) {
  return (
    <div className="accent-panel p-4 text-sm text-neutral-600 shadow-sm dark:text-neutral-300">
      <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 dark:text-neutral-500">Accent themes</p>
      <p className="mt-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">Choose the vibe of highlighted sections.</p>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Pick one look for light mode and another for dark mode. We’ll apply it to sections such as the holistic map.
      </p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <AccentSwatchGroup
          label="Light mode"
          active={currentLight}
          mode="light"
          onChange={onLightChange}
        />
        <AccentSwatchGroup
          label="Dark mode"
          active={currentDark}
          mode="dark"
          onChange={onDarkChange}
        />
      </div>
    </div>
  );
}

function AccentSwatchGroup({
  label,
  active,
  mode,
  onChange
}: {
  label: string;
  active: AccentChoice;
  mode: 'light' | 'dark';
  onChange: (value: AccentChoice) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">{label}</p>
      <div className="grid gap-3">
        {(Object.entries(ACCENT_SWATCHES) as [AccentChoice, (typeof ACCENT_SWATCHES)[AccentChoice]][]).map(([value, config]) => {
          const isActive = active === value;
          return (
            <button
              key={`${label}-${value}`}
              type="button"
              onClick={() => onChange(value)}
              className={cn(
                'rounded-2xl border p-2.5 text-left transition focus:outline-none',
                isActive
                  ? 'border-primary-500 ring-2 ring-primary-200 dark:border-primary-400 dark:ring-primary-800/40'
                  : 'border-neutral-200 hover:border-primary-200 dark:border-neutral-700 dark:hover:border-primary-500/60'
              )}
            >
              <span
                className={cn(
                  'block h-10 w-full rounded-lg shadow-inner',
                  mode === 'light' ? config.lightClass : config.darkClass
                )}
              />
              <span className="mt-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-100">{config.label}</span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{config.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const PLAN_LABELS: Record<string, string> = {
  free: 'NoStress Free',
  plus: 'NoStress+',
  newsletter: 'Newsletter-only'
};

const ACCENT_SWATCHES: Record<
  AccentChoice,
  { label: string; description: string; lightClass: string; darkClass: string }
> = {
  classic: {
    label: 'Classic',
    description: 'Soft neutrals with subtle depth.',
    lightClass: 'bg-gradient-to-br from-neutral-50 via-white to-primary-50',
    darkClass: 'bg-gradient-to-br from-neutral-900 via-neutral-950 to-primary-900/40'
  },
  vivid: {
    label: 'Vivid',
    description: 'Lush gradients with more color.',
    lightClass: 'bg-gradient-to-br from-orange-50 via-rose-50 to-sky-100',
    darkClass: 'bg-gradient-to-br from-[#1f1b2e] via-[#0f1f2c] to-[#133033]'
  }
};

const formInitialState: ProfileActionState = {};

export function ProfileForm({
  displayName,
  avatarUrl,
  email,
  role,
  favoritePillars,
  plan,
  lightAccent,
  darkAccent
}: ProfileFormProps) {
  const [state, formAction] = useFormState<ProfileActionState, FormData>(updateProfile, formInitialState);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('unchanged');
  const [persistedAvatar, setPersistedAvatar] = useState<string | null>(avatarUrl);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [currentDisplayName, setCurrentDisplayName] = useState<string | null>(displayName);
  const [selectedPillars, setSelectedPillars] = useState<HolisticPillar[]>(favoritePillars);
  const [lightAccentChoice, setLightAccentChoice] = useState<AccentChoice>(lightAccent ?? 'classic');
  const [darkAccentChoice, setDarkAccentChoice] = useState<AccentChoice>(darkAccent ?? 'classic');
  const { refresh } = useAuth();
  const { setAccentTheme } = useAccentTheme();

  useEffect(() => {
    setPersistedAvatar(avatarUrl);
    setPreview(avatarUrl);
    setSelectedAvatar('unchanged');
    setCurrentDisplayName(displayName);
    setSelectedPillars(favoritePillars);
    setLightAccentChoice(lightAccent ?? 'classic');
    setDarkAccentChoice(darkAccent ?? 'classic');
  }, [avatarUrl, displayName, favoritePillars, lightAccent, darkAccent]);

  useEffect(() => {
    if (state.error) {
      if (state.favoritePillars) {
        setSelectedPillars(state.favoritePillars);
      }
      if (state.lightAccent) {
        setLightAccentChoice(state.lightAccent);
      }
      if (state.darkAccent) {
        setDarkAccentChoice(state.darkAccent);
      }
    }
  }, [state.darkAccent, state.error, state.favoritePillars, state.lightAccent]);

  useEffect(() => {
    if (state.success) {
      const nextDisplayName = state.displayName ?? currentDisplayName ?? null;
      const nextAvatarUrl = state.avatarUrl ?? persistedAvatar ?? null;
      const nextFavoritePillars = state.favoritePillars ?? selectedPillars;
      const nextLightAccent = state.lightAccent ?? lightAccentChoice;
      const nextDarkAccent = state.darkAccent ?? darkAccentChoice;
      setPreview(nextAvatarUrl);
      setPersistedAvatar(nextAvatarUrl);
      setCurrentDisplayName(nextDisplayName);
      setSelectedAvatar('unchanged');
      setSelectedPillars(nextFavoritePillars);
      setLightAccentChoice(nextLightAccent);
      setDarkAccentChoice(nextDarkAccent);
      setAccentTheme({ light: nextLightAccent, dark: nextDarkAccent });
      void refresh();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('profile:updated', {
            detail: {
              displayName: nextDisplayName,
              avatarUrl: nextAvatarUrl
            }
          })
        );
      }
    }
  }, [
    currentDisplayName,
    persistedAvatar,
    refresh,
    selectedPillars,
    lightAccentChoice,
    darkAccentChoice,
    setAccentTheme,
    state.avatarUrl,
    state.displayName,
    state.favoritePillars,
    state.lightAccent,
    state.darkAccent,
    state.success
  ]);

  const initials = useMemo(() => {
    const source = currentDisplayName || email;
    return source
      .split(' ')
      .map((part) => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  }, [currentDisplayName, email]);

  const selectionValid = selectedPillars.length >= 2 && selectedPillars.length <= 3;
  const currentLightAccent = lightAccentChoice;
  const currentDarkAccent = darkAccentChoice;

  const handleLightAccentChange = (value: AccentChoice) => {
    setLightAccentChoice(value);
    setAccentTheme({ light: value, persist: false });
  };

  const handleDarkAccentChange = (value: AccentChoice) => {
    setDarkAccentChoice(value);
    setAccentTheme({ dark: value, persist: false });
  };

  const togglePillar = (pillar: HolisticPillar) => {
    setSelectedPillars((prev) => {
      if (prev.includes(pillar)) {
        return prev.filter((item) => item !== pillar);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, pillar];
    });
  };

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="selectedAvatar" value={selectedAvatar} />
      <div className="accent-panel p-4 text-sm text-neutral-600 dark:text-neutral-300">
        <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 dark:text-neutral-500">Plan</p>
        <p className="mt-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
          {PLAN_LABELS[plan ?? 'free'] ?? PLAN_LABELS.free}
        </p>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Free members get in-app pillar alerts. Upgrade to NoStress+ anytime for full library access and upcoming live tools.
        </p>
        <Link href="/pro" className="mt-2 inline-flex items-center text-xs font-semibold text-primary-600 hover:underline">
          View plans →
        </Link>
      </div>
      <AccentThemeCard
        currentLight={currentLightAccent}
        currentDark={currentDarkAccent}
        onLightChange={handleLightAccentChange}
        onDarkChange={handleDarkAccentChange}
      />
      <input type="hidden" name="lightAccent" value={currentLightAccent} />
      <input type="hidden" name="darkAccent" value={currentDarkAccent} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24">
          <Avatar className="h-full w-full border border-neutral-200 dark:border-neutral-700">
            {preview ? (
              <AvatarImage src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200 text-lg font-semibold">
                {initials || '?'}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
          <p className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Choose an avatar</p>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
            {PRESET_AVATARS.map((url) => {
              const active =
                selectedAvatar === url ||
                (selectedAvatar === 'unchanged' && persistedAvatar === url);
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(url);
                    setPreview(url);
                  }}
                  className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border transition ${
                    active
                      ? 'border-primary-500 ring-2 ring-primary-200 dark:border-primary-400 dark:ring-primary-700/40'
                      : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-500'
                  }`}
                  aria-pressed={active}
                >
                  <img src={url} alt="Preset avatar" className="h-full w-full object-cover" />
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setSelectedAvatar('none');
                setPreview(null);
              }}
              className={`flex h-12 w-12 items-center justify-center rounded-full border text-xs transition ${
                selectedAvatar === 'none' || (selectedAvatar === 'unchanged' && !persistedAvatar)
                  ? 'border-primary-500 ring-2 ring-primary-200 dark:border-primary-400 dark:ring-primary-700/40'
                  : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-500'
              }`}
            >
              None
            </button>
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">Select one of the curated avatars or choose none.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:max-w-xl">
        <div className="space-y-2">
          <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-100">
            Display name
          </label>
          <input
            id="displayName"
            name="displayName"
            defaultValue={displayName ?? ''}
            placeholder="Your name"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div className="space-y-1 text-sm text-neutral-500 dark:text-neutral-400">
          <p>Email: <span className="font-medium text-neutral-800 dark:text-neutral-200">{email}</span></p>
          <p>Role: <span className="font-medium text-neutral-800 dark:text-neutral-200">{role ?? 'viewer'}</span></p>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-100">Focus pillars</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Pick 2 or 3 areas you want updates on. When new content is published manually, we’ll prioritise these.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {HOLISTIC_PILLARS.map((pillar) => {
              const active = selectedPillars.includes(pillar.id);
              return (
                <label
                  key={pillar.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/40 dark:text-primary-100'
                      : 'border-neutral-200 text-neutral-500 hover:border-primary-200 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-primary-500/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="favoritePillars"
                    value={pillar.id}
                    className="sr-only"
                    checked={active}
                    onChange={() => togglePillar(pillar.id)}
                  />
                  {pillar.name}
                </label>
              );
            })}
          </div>
          <p
            className={`text-xs ${selectionValid ? 'text-neutral-500 dark:text-neutral-400' : 'text-red-500 dark:text-red-400'}`}
          >
            {selectedPillars.length} selected — {selectionValid ? 'perfect' : 'choose exactly 2 or 3 pillars.'}
          </p>
        </div>
      </div>

      {state.error && <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
      {state.success && <p className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{state.success}</p>}

      <SubmitButton disabled={!selectionValid} />
    </form>
  );
}
