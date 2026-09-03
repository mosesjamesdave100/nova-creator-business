// Every Supabase Auth call the app makes goes through here - components
// never import supabase directly for auth, they call these functions and
// get back a plain { data, error } shape with `error` already a
// human-friendly string (or null), never a raw Supabase error object.
import { supabase } from "../lib/supabaseClient";
import { mapAuthError } from "./authErrors";

// `emailRedirectTo` should point at the deployed app's own origin (see the
// analogous comment on requestPasswordReset below) so the confirmation link
// lands back on whichever environment the user actually signed up from,
// instead of whatever Site URL happens to be configured as the project-wide
// Supabase dashboard default.
export async function signUp({ email, password, displayName, emailRedirectTo }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || null },
      emailRedirectTo,
    },
  });
  if (error) return { data: null, error: mapAuthError(error) };
  return { data, error: null };
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { data: null, error: mapAuthError(error) };
  return { data, error: null };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) return { error: mapAuthError(error) };
  return { error: null };
}

// `redirectTo` should point at the deployed app's #/reset-password route so
// the email link lands back inside NOVA rather than a Supabase-hosted page -
// see docs/deployment section on configuring this in the Supabase dashboard
// (Authentication -> URL Configuration -> Redirect URLs) per environment.
export async function requestPasswordReset(email, redirectTo) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { error: mapAuthError(error) };
  return { error: null };
}

// Called from the reset-password screen once Supabase's email link has
// logged the browser into a temporary recovery session.
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: mapAuthError(error) };
  return { error: null };
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return { session: null, error: mapAuthError(error) };
  return { session: data.session, error: null };
}

// Fires immediately with the current session, then again on every sign-in/
// sign-out/token-refresh - this is the one thing AuthContext subscribes to
// so auth state never has to be polled or duplicated per-page.
export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return data.subscription;
}
