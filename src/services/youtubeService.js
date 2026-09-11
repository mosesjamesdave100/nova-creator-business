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
