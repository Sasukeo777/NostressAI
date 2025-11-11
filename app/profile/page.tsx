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

  const supabase = createSupabaseServerComponentClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, favorite_pillars, plan, light_accent, dark_accent')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-16">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur px-8 py-10 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Account settings</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Update your public profile and manage access to administrative tools.
        </p>
        <div className="mt-10">
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
      </div>
      {role === 'admin' && (
        <div className="rounded-2xl border border-primary-200 bg-primary-50/70 px-8 py-6 dark:border-primary-700/40 dark:bg-primary-900/20">
          <h2 className="text-sm font-semibold text-primary-700 dark:text-primary-200">Administrator access</h2>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
            You have administrator privileges. Open the dashboard to manage courses, articles, and resources.
          </p>
          <Link
            href="/admin"
            className="mt-4 inline-flex items-center justify-center rounded-md border border-primary-500 px-4 py-2 text-xs font-medium text-primary-700 transition hover:bg-primary-100 dark:border-primary-400 dark:text-primary-200 dark:hover:bg-primary-900/30"
          >
            Open admin dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
