-- Newsletter subscribers
-- Source of truth for the marketing list. Brevo is a downstream copy, not the master.
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),

  email text not null unique,
  full_name text,

  -- subscribed | unsubscribed | bounced | complained
  status text not null default 'subscribed',

  -- where the signup came from, so we can see which placements actually work
  source text not null default 'website',

  -- proof of consent, in case a subscriber ever disputes it
  consent_ip text,
  consent_at timestamptz not null default now(),

  -- one-click unsubscribe link in emails we send ourselves via Resend
  unsubscribe_token uuid not null unique default gen_random_uuid(),

  -- Brevo sync state
  brevo_contact_id bigint,
  synced_to_brevo boolean not null default false,
  brevo_sync_error text,

  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint newsletter_subscribers_status_check
    check (status in ('subscribed', 'unsubscribed', 'bounced', 'complained'))
);

-- Emails are matched case-insensitively everywhere, so store them lowercased.
create or replace function public.normalize_newsletter_email()
returns trigger as $$
begin
  new.email := lower(trim(new.email));
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists newsletter_subscribers_normalize on public.newsletter_subscribers;
create trigger newsletter_subscribers_normalize
  before insert or update on public.newsletter_subscribers
  for each row execute function public.normalize_newsletter_email();

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);

create index if not exists newsletter_subscribers_unsynced_idx
  on public.newsletter_subscribers (synced_to_brevo)
  where synced_to_brevo = false;

-- Lock the table down. No anon or authenticated policies are defined, so the
-- public API keys cannot read or write it at all. Only the service role key
-- (used server-side in API routes) can touch this data.
alter table public.newsletter_subscribers enable row level security;
