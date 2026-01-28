import './globals.css';
import type { ReactNode } from 'react';
import { Work_Sans, Playfair_Display } from 'next/font/google';
import { DockNavbar } from '@/components/layout/DockNavbar';
import { NatureFooter } from '@/components/layout/NatureFooter';
import { AuthProvider } from '@/lib/auth-context';
import { createSupabaseServerComponentClient } from '@/lib/supabase/auth';
import { ConsentProvider } from '@/components/legal/ConsentProvider';
import { CookieConsentBanner } from '@/components/legal/CookieConsentBanner';
import { PlausibleScript } from '@/components/analytics/PlausibleScript';
import { MarketingScripts } from '@/components/marketing/MarketingScripts';
import type { HolisticPillar, AccentChoice } from '@/lib/types';
import { PILLAR_IDS } from '@/lib/pillars';
import { AuthWrapper } from '@/components/layout/AuthWrapper';
import { Suspense } from 'react';
import { AccentThemeProvider } from '@/lib/accent-theme-context';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

export const metadata = {
  title: {
    default: 'NoStress AI',
    template: '%s | NoStress AI'
  },
  description: 'Training, tools, and research-backed routines to reduce mental load and use AI intentionally.',
  metadataBase: new URL('https://www.nostress.ai'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'NoStress AI',
    description: 'Training, tools, and research-backed routines to reduce mental load and use AI intentionally.',
    type: 'website',
    locale: 'en_US'
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Inline script executed before React hydration to persist the chosen theme without flicker
  const themeScript = `(()=>{try{const ls=localStorage.getItem('theme');const mql=window.matchMedia('(prefers-color-scheme: dark)');const wantDark = ls? ls==='dark' : mql.matches; if(wantDark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); document.documentElement.dataset.theme = wantDark ? 'dark' : 'light';}catch(e){}})();`;



  return (
    <html lang="en" suppressHydrationWarning className={`${workSans.variable} ${playfair.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-100 transition-colors duration-300">
        <Suspense fallback={<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950" />}>
          <AuthWrapper>
            <AccentThemeProvider>
              <SmoothScrollProvider>
                <ConsentProvider>
                  <DockNavbar />
                  <main className="flex-grow flex flex-col relative z-0">
                    {children}
                  </main>
                  <NatureFooter />
                  <CookieConsentBanner />
                  <PlausibleScript />
                  <MarketingScripts />
                </ConsentProvider>
              </SmoothScrollProvider>
            </AccentThemeProvider>
          </AuthWrapper>
        </Suspense>
      </body>
    </html>
  );
}
