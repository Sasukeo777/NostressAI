alter table public.profiles
  add column if not exists light_accent text not null default 'classic',
  add column if not exists dark_accent text not null default 'classic';
