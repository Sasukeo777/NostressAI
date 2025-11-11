alter table public.profiles
  drop constraint if exists profiles_plan_valid;

alter table public.profiles
  add constraint profiles_plan_valid
  check (plan in ('free', 'plus', 'newsletter'));
