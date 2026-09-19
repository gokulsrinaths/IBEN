-- Public professional profiles, published only through the admin
-- review/publish flow. This is a separate table from `submissions`
-- on purpose: `submissions` stays fully private (raw applicant
-- input), while `professionals` is the "approved recognition
-- records" public view described in README's Supabase-later plan.

create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  city text not null,
  state text not null,
  category text not null,
  specialisations text[] not null default '{}',
  recognition text not null,
  year int not null,
  profile_id text not null unique,
  image text not null,
  bio text not null,
  experience text not null,
  portfolio jsonb not null default '[]',
  status text not null default 'draft'
    check (status in ('draft', 'published', 'withdrawn')),
  submission_id uuid references public.submissions(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists professionals_status_idx
  on public.professionals (status);

alter table public.professionals enable row level security;

-- The one deliberate public policy on this whole project: anyone
-- (anon or authenticated) may read a row once it is published.
-- Writes are never exposed here -- only the service_role key
-- (admin API routes) can insert/update/delete.
create policy "Published professionals are public"
  on public.professionals
  for select
  using (status = 'published');

-- Public storage bucket for headshots and portfolio images. Public
-- because a published professional's photos are meant to be visible
-- on the live site; only admin upload routes (service_role) write
-- here. This sidesteps the multipart-size problem noted for the
-- public submission form: an admin uploads a handful of already-
-- chosen images one at a time, not an unauthenticated 8-file batch.
insert into storage.buckets (id, name, public)
values ('professional-photos', 'professional-photos', true)
on conflict (id) do nothing;
