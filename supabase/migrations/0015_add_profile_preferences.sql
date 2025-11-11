alter table public.profiles
  add column if not exists favorite_pillars text[] not null default array[]::text[],
  add column if not exists plan text not null default 'free';

alter table public.profiles
  add constraint profiles_favorite_pillars_valid
  check (
    favorite_pillars <@ array[
      'nutrition',
      'work',
      'sleep',
      'mind-body',
      'ai-tools',
      'analog-tools',
      'neuroplasticity',
      'societal-impact',
      'purpose'
    ]::text[]
  );

alter table public.profiles
  add constraint profiles_favorite_pillars_limit
  check (cardinality(favorite_pillars) <= 3);

alter table public.profiles
  add constraint profiles_plan_valid
  check (plan in ('free', 'premium'));
