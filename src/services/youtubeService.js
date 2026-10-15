// Starts the real YouTube OAuth flow via the Phase 3B Edge Function
// (supabase/functions/youtube-oauth-start). supabase.functions.invoke()
// automatically attaches the current session's access token as the
// Authorization header - the same client/session every other service in
// this app already uses - so nothing here ever reads, stores, or logs the
// token itself. The Edge Function requires GET (see its own method check).
import { supabase } from "../lib/supabaseClient";

const FRIENDLY_ERROR = "We couldn't start the YouTube connection. Please try again.";

export async function startYoutubeConnection() {
  const { data, error } = await supabase.functions.invoke("youtube-oauth-start", { method: "GET" });
  if (error || !data?.url) return { url: null, error: FRIENDLY_ERROR };
  return { url: data.url, error: null };
}

// Real channel numbers for the signed-in user, read server-side by the
// youtube-channel-stats Edge Function with the tokens stored at connect
// time - the browser never sees those tokens. Resolves to { stats, error }
// where `error` is one of the function's codes ("reauth_required",
// "no_channel", "not_connected", "unavailable") so callers can tell "needs
// reconnecting" apart from a transient failure.
export async function fetchYoutubeChannelStats() {
  const { data, error } = await supabase.functions.invoke("youtube-channel-stats", { method: "GET" });
  if (!error && data && !data.error) return { stats: data, error: null };

  let code = data?.error ?? "unavailable";
  if (error?.context && typeof error.context.json === "function") {
    try {
      code = (await error.context.json())?.error ?? code;
    } catch {
      // Non-JSON error body - keep the generic code.
    }
  }
  return { stats: null, error: code };
}
