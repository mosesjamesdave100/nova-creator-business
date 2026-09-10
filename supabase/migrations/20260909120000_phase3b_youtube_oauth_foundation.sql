-- Phase 3B: secure backend foundation for real OAuth connections (starting
-- with YouTube). Additive only - does not alter the profiles or
-- connected_accounts table definitions, nor any of their existing RLS
-- policies.
--
-- Two new tables, both intentionally locked out of the normal frontend
-- Supabase client:
--
--   oauth_states                   - short-lived, single-use OAuth state,
--                                     binding an in-flight authorization
--                                     attempt to the NOVA user who started
--                                     it.
--   connected_account_credentials  - the actual OAuth tokens. Kept
--                                     separate from connected_accounts (the
--                                     public "is this connected"
--                                     identity/status record every
--                                     dashboard page already reads) and
--                                     from profiles.
--
-- Neither table gets a policy for the `authenticated` or `anon` role below.
-- RLS is enabled with NO policies on either one, so PostgREST - the API the
-- browser talks to - can never select/insert/update/delete a row in either
-- table no matter whose JWT is presented; that omission is the security
-- control, not an oversight. Only Supabase's service_role key, used
-- exclusively inside supabase/functions/youtube-oauth-start and
-- youtube-oauth-callback and never shipped to the browser, bypasses RLS and
-- can touch these tables.

-- =========================================================================
-- oauth_states
-- =========================================================================
create table if not exists public.oauth_states (
  id uuid primary key default gen_random_uuid(),
  state text not null unique,
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null check (provider in ('youtube')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.oauth_states enable row level security;

-- Speeds up the callback's expiry check and any future cleanup of expired
-- rows. Consumption itself is a single `delete ... returning` in the
-- callback function - Postgres row locking means only one of two
-- simultaneous callbacks for the same state can ever win that delete, which
-- is what makes a state genuinely single-use rather than just
-- single-use-by-convention.
create index if not exists oauth_states_expires_at_idx on public.oauth_states (expires_at);

-- =========================================================================
-- connected_account_credentials
-- =========================================================================
-- One row per real OAuth connection's tokens, one-to-one with the
-- connected_accounts row it belongs to.
create table if not exists public.connected_account_credentials (
  id uuid primary key default gen_random_uuid(),
  connected_account_id uuid not null references public.connected_accounts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null check (provider in ('youtube')),
  access_token text not null,
  refresh_token text,
  token_type text,
  expires_at timestamptz,
  scope text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One credential row per connected_accounts row...
  unique (connected_account_id),
  -- ...and per user+provider, so a user can never end up with two
  -- credential rows for the same provider.
  unique (user_id, provider)
);

alter table public.connected_account_credentials enable row level security;
-- No policies here either, for the same reason as oauth_states above.

-- Reuses the touch_updated_at() trigger function schema.sql already
-- defines for profiles/connected_accounts, rather than redefining it.
drop trigger if exists set_connected_account_credentials_updated_at on public.connected_account_credentials;
create trigger set_connected_account_credentials_updated_at
  before update on public.connected_account_credentials
  for each row execute procedure public.touch_updated_at();
