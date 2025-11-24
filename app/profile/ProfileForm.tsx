'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileActionState, updateProfile } from './actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/AvatarFallback';
import { Button } from '@/components/ui/Button';
import { Loader2, Check, User, Sparkles, Palette, CreditCard } from 'lucide-react';
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
    <Button
      type="submit"
      disabled={pending || disabled}
      className="w-full sm:w-auto rounded-full px-8"
      size="lg"
    >
      {pending ? (
        <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving…</span>
      ) : (
        'Save Changes'
      )}
    </Button>
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
    }
  }, [
    state.success,
    state.displayName,
    state.avatarUrl,
    state.favoritePillars,
    state.lightAccent,
    state.darkAccent,
    currentDisplayName,
    persistedAvatar,
    selectedPillars,
    lightAccentChoice,
    darkAccentChoice,
    refresh,
    setAccentTheme
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
    <form action={formAction} className="space-y-12">
      <input type="hidden" name="selectedAvatar" value={selectedAvatar} />
      <input type="hidden" name="lightAccent" value={lightAccentChoice} />
      <input type="hidden" name="darkAccent" value={darkAccentChoice} />

      {/* Identity Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-white/10 pb-4">
          <User className="h-5 w-5 text-primary-500" />
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Identity</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 space-y-4 text-center">
            <div className="relative h-32 w-32 mx-auto">
              <Avatar className="h-full w-full border-4 border-white dark:border-neutral-800 shadow-lg">
                {preview ? (
                  <AvatarImage src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200 text-2xl font-semibold">
                    {initials || '?'}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_AVATARS.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => { setSelectedAvatar(url); setPreview(url); }}
                  className={cn(
                    "relative h-8 w-8 rounded-full overflow-hidden border-2 transition-all hover:scale-110",
                    (selectedAvatar === url || (selectedAvatar === 'unchanged' && persistedAvatar === url))
                      ? "border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900"
                      : "border-transparent hover:border-neutral-300"
                  )}
                >
                  <img src={url} alt="Avatar option" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow space-y-6 w-full">
            <div className="space-y-2">
              <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Display Name</label>
              <input
                id="displayName"
                name="displayName"
                defaultValue={displayName ?? ''}
                placeholder="How should we call you?"
                className="w-full rounded-xl border border-neutral-200 bg-white/50 px-4 py-3 text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-primary-400 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{email}</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">Role</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">{role ?? 'Viewer'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Pillars Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-white/10 pb-4">
          <Sparkles className="h-5 w-5 text-primary-500" />
          <div className="flex-grow">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Focus Pillars</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Select 2-3 areas to prioritize in your feed.</p>
          </div>
          <span className={cn("text-xs font-medium px-2 py-1 rounded-full", selectionValid ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300")}>
            {selectedPillars.length} selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {HOLISTIC_PILLARS.map((pillar) => {
            const active = selectedPillars.includes(pillar.id);
            return (
              <label
                key={pillar.id}
                className={cn(
                  "group relative flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-200",
                  active
                    ? "border-primary-500 bg-primary-50/50 dark:border-primary-400 dark:bg-primary-900/20"
                    : "border-neutral-200 bg-white/50 hover:border-primary-200 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                )}
              >
                <input
                  type="checkbox"
                  name="favoritePillars"
                  value={pillar.id}
                  className="sr-only"
                  checked={active}
                  onChange={() => togglePillar(pillar.id)}
                />
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                  active ? "border-primary-500 bg-primary-500 text-white" : "border-neutral-300 dark:border-neutral-600"
                )}>
                  {active && <Check className="h-3 w-3" />}
                </div>
                <span className={cn("text-sm font-medium", active ? "text-primary-900 dark:text-primary-100" : "text-neutral-600 dark:text-neutral-300")}>
                  {pillar.name}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Theme Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-white/10 pb-4">
          <Palette className="h-5 w-5 text-primary-500" />
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">Appearance</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Light Mode</p>
            <div className="grid gap-3">
              {(Object.entries(ACCENT_SWATCHES) as [AccentChoice, (typeof ACCENT_SWATCHES)[AccentChoice]][]).map(([value, config]) => (
                <button
                  key={`light-${value}`}
                  type="button"
                  onClick={() => { setLightAccentChoice(value); setAccentTheme({ light: value, persist: false }); }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                    lightAccentChoice === value
                      ? "border-primary-500 ring-1 ring-primary-500 bg-primary-50/30 dark:bg-primary-900/10"
                      : "border-neutral-200 hover:border-neutral-300 dark:border-white/10 dark:hover:border-white/20"
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-lg shadow-sm", config.lightClass)} />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{config.label}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{config.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Dark Mode</p>
            <div className="grid gap-3">
              {(Object.entries(ACCENT_SWATCHES) as [AccentChoice, (typeof ACCENT_SWATCHES)[AccentChoice]][]).map(([value, config]) => (
                <button
                  key={`dark-${value}`}
                  type="button"
                  onClick={() => { setDarkAccentChoice(value); setAccentTheme({ dark: value, persist: false }); }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                    darkAccentChoice === value
                      ? "border-primary-500 ring-1 ring-primary-500 bg-primary-50/30 dark:bg-primary-900/10"
                      : "border-neutral-200 hover:border-neutral-300 dark:border-white/10 dark:hover:border-white/20"
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-lg shadow-sm", config.darkClass)} />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{config.label}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{config.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plan Section */}
      <section className="rounded-2xl bg-neutral-900 dark:bg-white/5 p-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-300 mb-2">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Current Plan</span>
            </div>
            <h3 className="text-2xl font-serif font-medium">{PLAN_LABELS[plan ?? 'free'] ?? PLAN_LABELS.free}</h3>
            <p className="text-neutral-400 text-sm max-w-md">
              {plan === 'plus'
                ? "You have full access to all courses, tools, and premium content."
                : "Upgrade to NoStress+ to unlock the full library of courses and tools."}
            </p>
          </div>
          <Link
            href="/pro"
            className="px-4 py-2 rounded-full bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            {plan === 'plus' ? 'Manage Subscription' : 'Upgrade Plan'}
          </Link>
        </div>
      </section>

      <div className="pt-6 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
        <AnimatePresence>
          {state.success && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Changes saved successfully
            </motion.p>
          )}
          {state.error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-600 dark:text-red-400"
            >
              {state.error}
            </motion.p>
          )}
        </AnimatePresence>
        <SubmitButton disabled={!selectionValid} />
      </div>
    </form>
  );
}
