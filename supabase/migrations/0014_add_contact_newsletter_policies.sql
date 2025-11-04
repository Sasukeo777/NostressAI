-- Ensure updated_at columns stay fresh on updates
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
  before update on public.contact_messages
  for each row
  execute function public.set_updated_at();

drop trigger if exists newsletter_signups_set_updated_at on public.newsletter_signups;
create trigger newsletter_signups_set_updated_at
  before update on public.newsletter_signups
  for each row
  execute function public.set_updated_at();

-- RLS policies for admin access via Supabase auth (service role bypasses automatically)
drop policy if exists "Admins read contact messages" on public.contact_messages;
create policy "Admins read contact messages" on public.contact_messages
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  );

drop policy if exists "Admins delete contact messages" on public.contact_messages;
create policy "Admins delete contact messages" on public.contact_messages
  for delete
  using (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  );

drop policy if exists "Admins read newsletter signups" on public.newsletter_signups;
create policy "Admins read newsletter signups" on public.newsletter_signups
  for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  );

drop policy if exists "Admins delete newsletter signups" on public.newsletter_signups;
create policy "Admins delete newsletter signups" on public.newsletter_signups
  for delete
  using (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  );

drop policy if exists "Admins update newsletter signups" on public.newsletter_signups;
create policy "Admins update newsletter signups" on public.newsletter_signups
  for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.user_id = auth.uid()
        and p.role = 'admin'
    )
  );
