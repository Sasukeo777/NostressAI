import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthContext } from '@/lib/auth';
import { createSupabaseServerComponentClient } from '@/lib/supabase/auth';
import { ProfileForm } from './ProfileForm';
import type { AccentChoice, HolisticPillar } from '@/lib/types';

export const metadata = {
  title: 'Your Profile'
};

export default async function ProfilePage() {
  const { user, role } = await getAuthContext();
  if (!user) {
    redirect('/login');
  }

  const supabase = await createSupabaseServerComponentClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, favorite_pillars, plan, light_accent, dark_accent')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <div className="relative min-h-screen py-20">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[image:var(--nature-glow)] dark:bg-[image:var(--nature-glow-dark)] opacity-30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/20 dark:bg-primary-900/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-200/20 dark:bg-accent-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="site-container relative z-10 max-w-4xl space-y-8">
        <div className="space-y-2 text-center mb-12">
          <h1 className="font-serif text-4xl font-medium text-neutral-900 dark:text-white">Profile Settings</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Manage your personal preferences and account details.</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl shadow-xl p-8 md:p-12">
          <ProfileForm
            displayName={profile?.display_name ?? null}
            avatarUrl={profile?.avatar_url ?? null}
            email={user.email ?? ''}
            role={role}
            favoritePillars={
              (Array.isArray(profile?.favorite_pillars) ? profile?.favorite_pillars : []) as HolisticPillar[]
            }
            plan={profile?.plan ?? 'free'}
            lightAccent={(profile?.light_accent ?? 'classic') as AccentChoice}
            darkAccent={(profile?.dark_accent ?? 'classic') as AccentChoice}
          />
        </div>

        {role === 'admin' && (
          <div className="rounded-2xl border border-primary-200/50 bg-primary-50/50 backdrop-blur-sm px-8 py-6 dark:border-primary-700/30 dark:bg-primary-900/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-sm font-semibold text-primary-900 dark:text-primary-100">Administrator Access</h2>
                <p className="mt-1 text-xs text-primary-700/80 dark:text-primary-300/80">
                  Manage courses, articles, and platform resources.
                </p>
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-full bg-primary-100 px-6 py-2.5 text-xs font-semibold text-primary-900 transition hover:bg-primary-200 dark:bg-primary-900/40 dark:text-primary-100 dark:hover:bg-primary-900/60"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
