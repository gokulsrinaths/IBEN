-- Private submission intake: applications, nominations, enquiries.
-- No public policies are created. Only the service_role key (used
-- server-side in the Next.js API route) can read or write this data;
-- it bypasses Row Level Security entirely. Anon/authenticated clients
-- have zero access by design, since intake is only ever server-side.

create extension if not exists pgcrypto;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('application', 'nomination', 'contact')),
  reference text not null unique,
  values jsonb not null,
  status text not null default 'received'
    check (status in ('received', 'in_review', 'accepted', 'declined', 'withdrawn')),
  consent_version text not null,
  consent_at timestamptz not null default now(),
  reviewer_notes text,
  created_at timestamptz not null default now()
);

create index if not exists submissions_kind_created_at_idx
  on public.submissions (kind, created_at desc);

alter table public.submissions enable row level security;
-- Intentionally no policies: default-deny for anon and authenticated roles.

-- Private storage bucket for portfolio files. Left unused until signed
-- upload URLs are implemented (see OWNER_DECISIONS.md / README step 4) --
-- request-body size limits on serverless functions make the current
-- multipart transport unsafe for the full 8-file / 5MB-each allowance.
insert into storage.buckets (id, name, public)
values ('portfolios', 'portfolios', false)
on conflict (id) do nothing;
-- No storage.objects policies added: same default-deny posture as above.
