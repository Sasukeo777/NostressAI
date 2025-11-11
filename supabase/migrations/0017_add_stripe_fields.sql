alter table public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_status text,
  add column if not exists last_paid_newsletter_at timestamptz;
