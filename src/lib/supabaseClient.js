import { createClient } from "@supabase/supabase-js";

// Single shared Supabase client for the whole app. Every auth/profile
// operation goes through the service layer in src/services/, which imports
// this - nothing else should call createClient() or talk to Supabase
// directly, so there's exactly one place that owns the connection and the
// session it holds in memory/localStorage.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fails loudly at startup rather than letting every later call throw a
// confusing "Invalid URL" deep inside supabase-js - if this fires, the
// deploy is missing its .env (see .env.example).
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Copy .env.example to .env.local and fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persisted in localStorage by default (supabase-js's own session
    // storage, not something this app manages) so a refresh keeps the user
    // signed in; auto-refresh keeps the session alive across the token's
    // expiry without the user noticing.
    persistSession: true,
    autoRefreshToken: true,
    // Off deliberately: the app's HashRouter and Supabase's password-reset
    // redirect both reuse `location.hash`, so this app parses that redirect
    // itself (see src/auth/handleRecoveryRedirect.js) instead of letting
    // supabase-js's own auto-detection race it.
    detectSessionInUrl: false,
  },
});
