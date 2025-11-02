'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

interface UserProfile {
  displayName: string | null;
  avatarUrl: string | null;
  role: string | null;
}

interface AuthContextValue {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  refresh: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession?: Session | null;
  initialProfile?: UserProfile | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function ensureProfile(supabase: ReturnType<typeof createSupabaseBrowserClient>, user: User) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from('profiles').insert({ user_id: user.id });
  }
}

export function AuthProvider({ children, initialSession = null, initialProfile = null }: AuthProviderProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [loading, setLoading] = useState<boolean>(initialProfile ? false : !!initialSession);

  const fetchProfile = useCallback(
    async (targetSession?: Session | null) => {
      const currentSession = targetSession ?? (await supabase.auth.getSession()).data.session;
      const currentUser = currentSession?.user ?? null;

      if (!currentUser) {
        return null;
      }

      await ensureProfile(supabase, currentUser);

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, avatar_url, role')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.error('Failed to load profile after retries', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return null;
      }

      return {
        displayName: data?.display_name ?? null,
        avatarUrl: data?.avatar_url ?? null,
        role: data?.role ?? null
      } as UserProfile;
    },
    [supabase]
  );

  const loadProfile = useCallback(
    async (targetSession?: Session | null) => {
      setLoading(true);
      try {
        const nextProfile = await fetchProfile(targetSession);
        if (nextProfile) {
          setProfile(nextProfile);
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchProfile]
  );

  const refresh = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!initialSession) {
      if (initialProfile) {
        setLoading(false);
      } else {
        void loadProfile();
      }
      return;
    }

    setSession(initialSession);
    setUser(initialSession.user ?? null);

    if (initialProfile) {
      setLoading(false);
    } else {
      void loadProfile(initialSession);
    }
  }, [initialProfile, initialSession, loadProfile]);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setSession(nextSession ?? null);
        setUser(nextSession?.user ?? null);
        if (nextSession?.user) {
          await loadProfile(nextSession);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile, supabase]);

  const value = useMemo<AuthContextValue>(() => ({
    loading,
    session,
    user,
    profile,
    refresh
  }), [loading, profile, refresh, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
