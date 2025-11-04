'use client';

import { useEffect, useState } from 'react';
import { useConsent } from './ConsentProvider';

type DraftConsent = {
  analytics: boolean;
  marketing: boolean;
};

export function CookieConsentBanner() {
  const { ready, consent, bannerVisible, managerOpen, acceptAll, rejectAll, openManager, closeManager, saveConsent } = useConsent();
  const [draft, setDraft] = useState<DraftConsent>({ analytics: consent.analytics, marketing: consent.marketing });

  useEffect(() => {
    if (managerOpen) {
      setDraft({ analytics: consent.analytics, marketing: consent.marketing });
    }
  }, [managerOpen, consent.analytics, consent.marketing]);

  if (!ready) {
    return null;
  }

  const showBanner = bannerVisible && !managerOpen;
  const showManager = managerOpen;

  if (!showBanner && !showManager) {
    return null;
  }

  return (
    <>
      {showManager && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-3xl border border-neutral-100 bg-white/95 p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900/95">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Manage cookie preferences</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Essential cookies keep the site secure and functioning. Enable the categories you are comfortable with.
            </p>

            <div className="mt-6 space-y-4">
              <fieldset className="space-y-1 rounded-2xl border border-neutral-100/80 p-4 dark:border-neutral-800/80">
                <legend className="font-semibold text-neutral-800 dark:text-neutral-200">Essential</legend>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Always on. Required for authentication, security, and remembering your consent choices.
                </p>
              </fieldset>

              <label className="flex items-start gap-3 rounded-2xl border border-neutral-100/80 p-4 transition hover:border-primary-200 dark:border-neutral-800/80 dark:hover:border-primary-500/40">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900"
                  checked={draft.analytics}
                  onChange={(event) => setDraft((prev) => ({ ...prev, analytics: event.target.checked }))}
                />
                <div>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Analytics</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Help us understand aggregated usage so we can improve the NoStress AI experience.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-neutral-100/80 p-4 transition hover:border-primary-200 dark:border-neutral-800/80 dark:hover:border-primary-500/40">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900"
                  checked={draft.marketing}
                  onChange={(event) => setDraft((prev) => ({ ...prev, marketing: event.target.checked }))}
                />
                <div>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Marketing</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Allows us to deliver relevant updates or retargeting campaigns across platforms.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => saveConsent({ essential: true, analytics: draft.analytics, marketing: draft.marketing })}
                className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400"
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex items-center justify-center rounded-full border border-primary-200 px-5 py-2 text-sm font-semibold text-primary-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-primary-500/50 dark:text-primary-300 dark:hover:border-primary-400"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectAll();
                }}
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-5 py-2 text-sm font-semibold text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500"
              >
                Refuse all
              </button>
              <button
                type="button"
                onClick={closeManager}
                className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showBanner && (
        <div className="fixed inset-x-4 bottom-4 z-[60] md:left-6 md:right-auto md:max-w-md">
          <div className="rounded-3xl border border-neutral-100/80 bg-white/95 p-5 shadow-lg shadow-neutral-900/10 dark:border-neutral-800/70 dark:bg-neutral-900/95">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">We use cookies</h2>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Essential cookies keep NoStress AI secure and working. You can accept, refuse, or customise optional analytics and marketing cookies.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-5 py-2 text-sm font-semibold text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-500"
              >
                Refuse all
              </button>
              <button
                type="button"
                onClick={openManager}
                className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-neutral-500 transition hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-300"
              >
                Customise
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
