// Service-role Supabase client - the only context in this codebase allowed
// to bypass RLS. Used exclusively inside these Edge Functions (never
// shipped to the browser) to read/write oauth_states and
// connected_account_credentials, neither of which grants any policy to the
// anon/authenticated roles the frontend uses - a service-role client is the
// only way to reach them at all.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.4";

// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically by
// the Supabase Edge Runtime to every deployed function - nothing to
// configure manually for these two.
export function createAdminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
