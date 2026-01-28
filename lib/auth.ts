import { createSupabaseServerComponentClient } from '@/lib/supabase/auth';

export interface AuthContext {
  user: {
    id: string;
    email?: string;
  } | null;
  role: string | null;
}

export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createSupabaseServerComponentClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, role: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  return {
    user: { id: user.id, email: user.email ?? undefined },
    role: profile?.role ?? null
  };
}
