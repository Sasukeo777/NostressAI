'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerActionClient } from '@/lib/supabase/auth';
import type { AccentChoice, HolisticPillar } from '@/lib/types';
import { PILLAR_IDS } from '@/lib/pillars';

export interface ProfileActionState {
  error?: string;
  success?: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  favoritePillars?: HolisticPillar[];
  lightAccent?: AccentChoice;
  darkAccent?: AccentChoice;
}

const ACCENT_VALUES: AccentChoice[] = ['classic', 'vivid'];

export async function updateProfile(_: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const displayName = String(formData.get('displayName') ?? '').trim();
  const selectedAvatar = String(formData.get('selectedAvatar') ?? 'unchanged');
  const requestedPillars = formData.getAll('favoritePillars').map((value) => String(value));
  const favoritePillars = Array.from(
    new Set(
      requestedPillars.filter((pillar): pillar is HolisticPillar =>
        PILLAR_IDS.includes(pillar as HolisticPillar)
      )
    )
  );
  const rawLightAccent = String(formData.get('lightAccent') ?? 'classic') as AccentChoice;
  const rawDarkAccent = String(formData.get('darkAccent') ?? 'classic') as AccentChoice;
  const lightAccent = ACCENT_VALUES.includes(rawLightAccent) ? rawLightAccent : 'classic';
  const darkAccent = ACCENT_VALUES.includes(rawDarkAccent) ? rawDarkAccent : 'classic';

  if (favoritePillars.length < 2 || favoritePillars.length > 3) {
    return { error: 'Please select exactly 2 or 3 focus pillars.', favoritePillars, lightAccent, darkAccent };
  }

  const supabase = createSupabaseServerActionClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const { data: existingProfile, error: existingError } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingError && existingError.code !== 'PGRST116') {
    return { error: existingError.message };
  }

  let nextAvatarUrl = existingProfile?.avatar_url ?? null;
  if (selectedAvatar === 'none') {
    nextAvatarUrl = null;
  } else if (selectedAvatar !== 'unchanged' && selectedAvatar) {
    nextAvatarUrl = selectedAvatar;
  }

  const updates: Record<string, any> = {
    user_id: user.id,
    display_name: displayName || null,
    avatar_url: nextAvatarUrl,
    favorite_pillars: favoritePillars,
    light_accent: lightAccent,
    dark_accent: darkAccent
  };

  const { error: updateError } = await supabase
    .from('profiles')
    .upsert(updates, { onConflict: 'user_id' });

  if (updateError) {
    return { error: updateError.message, favoritePillars, lightAccent, darkAccent };
  }

  revalidatePath('/profile');
  revalidatePath('/admin');
  revalidatePath('/');

  return {
    success: 'Profile updated successfully.',
    displayName: updates.display_name,
    avatarUrl: nextAvatarUrl,
    favoritePillars,
    lightAccent,
    darkAccent
  };
}
