alter table public.articles
  add column if not exists is_listed boolean not null default true;

update public.articles
  set is_listed = true
  where is_listed is null;

alter table public.formations
  add column if not exists is_listed boolean not null default true;

update public.formations
  set is_listed = true
  where is_listed is null;
