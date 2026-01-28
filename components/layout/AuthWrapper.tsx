import { createSupabaseServerComponentClient } from '@/lib/supabase/auth';
import { AuthProvider } from '@/lib/auth-context';
import type { HolisticPillar, AccentChoice } from '@/lib/types';
import { PILLAR_IDS } from '@/lib/pillars';
import { ReactNode } from 'react';

export async function AuthWrapper({ children }: { children: ReactNode }) {
    const supabase = await createSupabaseServerComponentClient();
    const {
        data: { session }
    } = await supabase.auth.getSession();

    let initialProfile:
        | {
            displayName: string | null;
            avatarUrl: string | null;
            role: string | null;
            favoritePillars: HolisticPillar[];
            plan: string | null;
            lightAccent: AccentChoice;
            darkAccent: AccentChoice;
        }
        | null = null;

    const user = session?.user ?? null;
    if (user) {
        const { data: profileRow } = await supabase
            .from('profiles')
            .select('display_name, avatar_url, role, favorite_pillars, plan, light_accent, dark_accent')
            .eq('user_id', user.id)
            .maybeSingle();

        const favoritePillars = Array.isArray(profileRow?.favorite_pillars)
            ? (profileRow?.favorite_pillars.filter((pillar): pillar is HolisticPillar =>
                typeof pillar === 'string' && PILLAR_IDS.includes(pillar as HolisticPillar)
            ) as HolisticPillar[])
            : [];

        initialProfile = {
            displayName: profileRow?.display_name ?? null,
            avatarUrl: profileRow?.avatar_url ?? null,
            role: profileRow?.role ?? null,
            favoritePillars: favoritePillars as HolisticPillar[],
            plan: profileRow?.plan ?? 'free',
            lightAccent: (profileRow?.light_accent ?? 'classic') as AccentChoice,
            darkAccent: (profileRow?.dark_accent ?? 'classic') as AccentChoice
        };
    }

    return (
        <AuthProvider initialSession={session} initialProfile={initialProfile}>
            {children}
        </AuthProvider>
    );
}
