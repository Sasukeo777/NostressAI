alter table public.resources
  add column if not exists is_listed boolean not null default true;

update public.resources
  set is_listed = true
  where is_listed is null;
