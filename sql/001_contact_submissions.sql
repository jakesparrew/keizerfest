-- Contact form submissions for keizerfest.be
-- Run once on the target Supabase project (SQL editor → New query → Run).

create extension if not exists "pgcrypto";

create table if not exists public.contact_submissions (
  id           uuid        primary key default gen_random_uuid(),
  submitted_at timestamptz not null    default now(),
  name         text        not null,
  email        text        not null,
  subject      text,
  message      text        not null,
  locale       text,
  ip_address   text,
  user_agent   text,
  handled      boolean     not null    default false,
  notes        text
);

-- Lock the table down: only the service role (server-side) can read/write.
alter table public.contact_submissions enable row level security;

-- No policies = no anonymous access. Edge Function uses the service-role key
-- which bypasses RLS, so inserts from /api/contact still work.

-- Helpful indexes.
create index if not exists contact_submissions_submitted_at_idx
  on public.contact_submissions (submitted_at desc);

create index if not exists contact_submissions_handled_idx
  on public.contact_submissions (handled, submitted_at desc);

comment on table public.contact_submissions is
  'Inbound contact form submissions from keizerfest.be — written via /api/contact (Vercel) using the service-role key.';
