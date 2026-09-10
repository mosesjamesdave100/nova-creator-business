// Starts the YouTube OAuth flow for the currently authenticated NOVA user.
//
// Requires a valid Supabase session - enforced both by the platform's JWT
// verification for this function (verify_jwt = true in
// supabase/config.toml) and by the explicit auth.getUser() call below,
// which is what actually gives us the real user id used to bind the OAuth
// state. That user id - never anything the client could supply - is the
// only identity this flow ever trusts.
//
// Responds with { url } for the caller to navigate to, rather than issuing
// an HTTP redirect itself: this endpoint requires an Authorization header,
// which a plain top-level browser navigation (an <a href> or
// window.location assignment) can't attach, and a fetch() that
// auto-follows a 3xx response wouldn't re-attach it to the redirect target
// either. Handing back the URL and letting the caller perform the actual
// top-level navigation is the correct shape for an authenticated
// OAuth-initiation endpoint. Wiring an actual "Connect YouTube" button to
// call this is Phase 3C, not this phase.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.4";
import { createAdminClient } from "../_shared/supabaseAdmin.ts";
import { corsHeaders, handlePreflight } from "../_shared/cors.ts";
import { GOOGLE_AUTH_ENDPOINT, YOUTUBE_SCOPE, OAUTH_STATE_TTL_MS, generateState } from "../_shared/googleOAuth.ts";

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== "GET") {
    return json(req, { error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) {
    return json(req, { error: "YouTube OAuth is not configured yet" }, 500);
  }

  // A client scoped to the caller's own Authorization header - getUser()
  // asks Supabase's auth server to verify that token and hand back the real
  // user it belongs to, rather than this function trying to decode/verify
  // the JWT itself.
  const authHeader = req.headers.get("Authorization") ?? "";
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await callerClient.auth.getUser();
  if (userError || !userData?.user) {
    return json(req, { error: "Not authenticated" }, 401);
  }
  const userId = userData.user.id;

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const redirectUri = Deno.env.get("GOOGLE_OAUTH_REDIRECT_URI");
  if (!clientId || !redirectUri) {
    // Missing OAuth configuration - safe to say so since this response only
    // ever reaches an already-authenticated NOVA user, never Google.
    return json(req, { error: "YouTube OAuth is not configured yet" }, 500);
  }

  const state = generateState();
  const admin = createAdminClient();
  const { error: insertError } = await admin.from("oauth_states").insert({
    state,
    user_id: userId,
    provider: "youtube",
    expires_at: new Date(Date.now() + OAUTH_STATE_TTL_MS).toISOString(),
  });
  if (insertError) {
    return json(req, { error: "Could not start the connection. Please try again." }, 500);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: YOUTUBE_SCOPE,
    access_type: "offline",
    // Forces Google to re-show consent and reissue a refresh_token even if
    // this user connected before - without this, a reconnect can silently
    // omit the refresh_token.
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });

  return json(req, { url: `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}` }, 200);
});

function json(req: Request, body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(req) },
  });
}
