create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  consent boolean not null default false,
  consent_at timestamptz not null default now(),
  status text not null default 'pending',
  source_path text,
  double_opt_in_token text,
  double_opt_in_sent_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_signups_status_idx on public.newsletter_signups (status);

alter table public.newsletter_signups enable row level security;
