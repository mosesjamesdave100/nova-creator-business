import { supabase } from "../lib/supabaseClient";

// Supabase's password-reset email link lands with its session tokens
// appended into the exact same URL fragment HashRouter uses for routing -
// both reuse `#`. Supabase is fragment-aware and appends with `&` when the
// redirect URL already has one, so the browser receives something like:
//
//   https://site.com/#/reset-password&access_token=...&type=recovery
//
// Left alone, HashRouter would try to match the literal path
// "/reset-password&access_token=..." (it only knows to stop a path at `?`,
// not `&`) and fail to route at all. This runs once at startup, before the
// app renders, to pull the tokens out, establish the session directly via
// setSession, and leave HashRouter a clean "#/reset-password" so it can
// route normally afterward. detectSessionInUrl is off in supabaseClient.js
// so Supabase's own client never tries to parse this same string itself.
export async function handleRecoveryRedirect() {
  const hash = window.location.hash;
  if (!hash.includes("access_token=") || !hash.includes("type=recovery")) return;

  const paramString = hash.slice(hash.indexOf("&") + 1);
  const params = new URLSearchParams(paramString);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (accessToken && refreshToken) {
    try {
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    } catch {
      // Expired/invalid link - ResetPasswordPage's own auth check (no
      // active session) is what surfaces this to the user, not a crashed
      // app boot.
    }
  }

  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#/reset-password`);
}
