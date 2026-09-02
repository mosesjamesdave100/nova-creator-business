import { createClient } from "@supabase/supabase-js";

// Single shared Supabase client for the whole app. Every auth/profile
// operation goes through the service layer in src/services/, which imports
// this - nothing else should call createClient() or talk to Supabase
// directly, so there's exactly one place that owns the connection and the
// session it holds in memory/localStorage.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// True only when a real deploy-time config is present. Exported so any
// screen that wants to explain a config problem can check it directly,
// rather than everything just failing confusingly.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Never throw here: this module is imported at the very top of the app
  // (main.jsx -> App.jsx -> AuthContext), so throwing during module
  // evaluation stops React from mounting at all - a totally blank page with
  // no way to even show an error. A missing .env is expected on a fresh
  // GitHub Pages deploy that hasn't had its build-time secrets configured
  // yet; the app should still render (marketing pages work, auth-dependent
  // pages simply behave as "signed out") rather than go blank.
  console.warn(
    "[NOVA] Missing Supabase configuration (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). " +
      "Auth and profile features are disabled until this deploy's environment variables are set - see .env.example."
  );
}

// createClient only validates that the URL is well-formed, not that it's
// reachable, so a syntactically valid placeholder is enough to let the
// client construct successfully when real config is missing. Every actual
// call made against it will fail as a normal network/auth error - already
// handled by the service layer's error mapping - rather than a crash.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
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
  }
);
