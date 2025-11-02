'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Loader2, LogOut, Settings, ShieldCheck, User, X } from 'lucide-react';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { logout } from '@/app/login/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/AvatarFallback';
import { useAuth } from '@/lib/auth-context';

interface ProfileMenuProps {
  className?: string;
}

export function ProfileMenu({ className }: ProfileMenuProps) {
  const pathname = usePathname();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const { loading, user, profile, refresh } = useAuth();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [signOutPending, setSignOutPending] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Refresh profile when dialog closes (important for OAuth flows)
    if (!open) {
      void refresh();
    }
  }, [open, refresh]);

  useEffect(() => {
    const handleProfileUpdated = () => {
      void refresh();
    };
    window.addEventListener('profile:updated', handleProfileUpdated);
    return () => {
      window.removeEventListener('profile:updated', handleProfileUpdated);
    };
  }, [refresh]);

  const initials = useMemo(() => {
    const source = profile?.displayName || user?.email || '??';
    return source
      .split(' ')
      .map((part) => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  }, [profile?.displayName, user?.email]);

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    setMessage(undefined);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setPending(false);
      return;
    }

    if (mode === 'signin') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setPending(false);
        return;
      }
      await refresh();
      setPending(false);
      setOpen(false);
      setEmail('');
      setPassword('');
      window.location.href = '/';
    } else {
      const redirectTo = `${(typeof window !== 'undefined' && window.location.origin) || process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback?redirect_to=${encodeURIComponent('/')}`;
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo
        }
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage('Check your inbox to confirm your email. You can sign in once it is verified.');
        setMode('signin');
      }
      setPending(false);
    }
  }

  async function handleGoogleAuth(mode: 'signin' | 'signup') {
    setPending(true);
    setError(undefined);
    setMessage(undefined);
    const redirectTo = `${(typeof window !== 'undefined' && window.location.origin) || process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback?redirect_to=${encodeURIComponent('/')}`;
    const options: Parameters<typeof supabase.auth.signInWithOAuth>[0]['options'] = { redirectTo };
    if (mode === 'signup') {
      options.queryParams = { prompt: 'consent' };
    }
    console.log('Starting Google OAuth with redirect:', redirectTo);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google', options });
    if (oauthError) {
      console.error('OAuth error:', oauthError);
      setError(oauthError.message);
      setPending(false);
    } else {
      console.log('OAuth initiated, redirecting to Google...');
    }
  }

  async function handleSignOut() {
    setSignOutPending(true);
    setError(undefined);
    setMessage(undefined);
    await supabase.auth.signOut();
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
    await refresh();
    setSignOutPending(false);
    setOpen(false);
    window.location.href = '/';
  }

  const isAuthenticated = !!user;
  const currentEmail = user?.email ?? undefined;
  const displayName = profile?.displayName ?? currentEmail ?? null;
  const avatarUrl = profile?.avatarUrl ?? null;
  const role = profile?.role ?? null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 ${className ?? ''}`}
          disabled={loading && !isAuthenticated}
        >
          <Avatar className="h-7 w-7 overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName ?? currentEmail ?? 'Profile'} className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 text-xs font-semibold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="hidden sm:inline">{isAuthenticated ? displayName ?? currentEmail : 'Profile'}</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed right-4 top-20 z-[60] w-[360px] max-w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 sm:right-6">
          <div className="flex items-start justify-between">
            <Dialog.Title className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {isAuthenticated ? 'Account' : mode === 'signin' ? 'Welcome back' : 'Join NoStress AI'}
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {!isAuthenticated ? (
            <div className="mt-6 space-y-5 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(undefined);
                    setMessage(undefined);
                  }}
                  className={`rounded-full px-3 py-1 ${mode === 'signin' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(undefined);
                    setMessage(undefined);
                  }}
                  className={`rounded-full px-3 py-1 ${mode === 'signup' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                >
                  Create account
                </button>
              </div>

              <form className="space-y-3" onSubmit={handleEmailSubmit}>
                <div className="space-y-1">
                  <label htmlFor="profile-email" className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="profile-password" className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Password
                  </label>
                  <input
                    id="profile-password"
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-500 disabled:opacity-60"
                  disabled={pending}
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                  {mode === 'signin' ? 'Sign in with email' : 'Create account with email'}
                </button>
              </form>

              <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                <span className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
                <span>Or use Google</span>
                <span className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleGoogleAuth(mode)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  disabled={pending}
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                  Continue with Google
                </button>
              </div>

              {error && <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p>}
              {message && <p className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-xs text-success">{message}</p>}
            </div>
          ) : (
            <div className="mt-6 space-y-6 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-700">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={displayName ?? currentEmail ?? 'Profile'} className="h-full w-full object-cover" />
                  ) : (
                    <AvatarFallback className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 text-base font-semibold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{displayName ?? currentEmail}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{currentEmail}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Settings className="h-4 w-4" /> Profile settings
                </Link>
                {role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-full border border-primary-300 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-100 dark:border-primary-700/40 dark:bg-primary-900/20 dark:text-primary-200 dark:hover:bg-primary-900/40"
                  >
                    <ShieldCheck className="h-4 w-4" /> Admin dashboard
                  </Link>
                )}
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-60"
                  disabled={signOutPending}
                >
                  {signOutPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Sign out
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
