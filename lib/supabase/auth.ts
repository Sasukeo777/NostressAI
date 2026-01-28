import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.');
}

export const secureCookies = process.env.NODE_ENV === 'production';
export const resolvedSupabaseUrl = supabaseUrl as string;
export const resolvedSupabaseAnonKey = supabaseAnonKey as string;

export function createSupabaseClientWithCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(resolvedSupabaseUrl, resolvedSupabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        cookieStore.set({
          name,
          value,
          ...options,
          httpOnly: true,
          secure: secureCookies,
          sameSite: 'lax'
        });
      },
      remove(name, options) {
        cookieStore.delete({ name, ...options });
      }
    }
  });
}

export async function createSupabaseServerActionClient() {
  const cookieStore = await cookies();
  return createSupabaseClientWithCookies(cookieStore);
}

export async function createSupabaseServerComponentClient() {
  const cookieStore = await cookies();
  return createServerClient(resolvedSupabaseUrl, resolvedSupabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set() {
        /* no-op for server components */
      },
      remove() {
        /* no-op for server components */
      }
    }
  });
}
