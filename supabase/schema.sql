-- NOVA Phase 2A database schema.
--
-- Run this once in your Supabase project's SQL Editor (Project -> SQL Editor
-- -> New query -> paste this whole file -> Run). It's idempotent-ish via
-- IF NOT EXISTS / OR REPLACE where practical, but is meant to be run once on
-- a fresh project, not repeatedly against one that already has data.
--
-- Scope (per NOVA Phase 2A): auth (Supabase-managed, no table needed here),
-- profiles, and a connected_accounts foundation. Every other creator-data
-- entity (analytics, audience, revenue, sponsorships, products, community,
-- content, media_kits, notifications, insights) stays as the existing
-- src/data/*.js mock data for now - those get their own tables in the phase
-- that actually wires them to a real integration, so this migration isn't
-- speculatively building tables nothing reads or writes yet.

-- =========================================================================
-- profiles
-- =========================================================================
-- One row per creator, keyed to Supabase's built-in auth.users. Created
-- automatically by the trigger below the moment someone signs up - the
-- client never inserts this row directly, only reads/updates it, which
-- sidesteps any race condition between "user just signed up" and "user has
-- an active session that RLS will allow an insert under".
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text,
  username text unique,
  email text,
  avatar_url text,
  bio text,
  website text,
  category text,
  timezone text,
  currency text,
  goals text[] not null default '{}',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- =========================================================================
-- connected_accounts (foundation only - Phase 2B wires real OAuth into this)
-- =========================================================================
create table if not exists public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null check (
    platform in ('youtube', 'twitch', 'tiktok', 'instagram', 'discord', 'shopify', 'stripe')
  ),
  status text not null default 'disconnected' check (status in ('connected', 'disconnected', 'pending')),
  platform_user_id text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, platform)
);

alter table public.connected_accounts enable row level security;

drop policy if exists "connected_accounts_select_own" on public.connected_accounts;
create policy "connected_accounts_select_own"
  on public.connected_accounts for select
  using (auth.uid() = user_id);

drop policy if exists "connected_accounts_insert_own" on public.connected_accounts;
create policy "connected_accounts_insert_own"
  on public.connected_accounts for insert
  with check (auth.uid() = user_id);

drop policy if exists "connected_accounts_update_own" on public.connected_accounts;
create policy "connected_accounts_update_own"
  on public.connected_accounts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "connected_accounts_delete_own" on public.connected_accounts;
create policy "connected_accounts_delete_own"
  on public.connected_accounts for delete
  using (auth.uid() = user_id);

-- =========================================================================
-- Shared updated_at trigger
-- =========================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.touch_updated_at();

drop trigger if exists set_connected_accounts_updated_at on public.connected_accounts;
create trigger set_connected_accounts_updated_at
  before update on public.connected_accounts
  for each row execute procedure public.touch_updated_at();

-- =========================================================================
-- Auto-create a profile row when someone signs up
-- =========================================================================
-- security definer + a locked-down search_path so this runs with the
-- privileges it needs to insert into public.profiles (a fresh signup has no
-- row there yet to satisfy an RLS check against) without being hijackable
-- via a search_path attack.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
