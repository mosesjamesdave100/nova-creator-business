// Google's redirect lands here directly - a plain top-level browser
// navigation, with no Supabase session attached, which is why this
// function has verify_jwt = false in supabase/config.toml (unlike
// youtube-oauth-start). The only trustworthy identity anywhere in this
// request is whichever user_id was bound server-side to `state` when the
// flow started in youtube-oauth-start - nothing from the query string,
// Google or otherwise, is ever trusted as an identity.
import { createAdminClient } from "../_shared/supabaseAdmin.ts";
import { GOOGLE_TOKEN_ENDPOINT, siteUrl } from "../_shared/googleOAuth.ts";

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
};

function redirectTo(status: "connected" | "denied" | "error"): Response {
  return Response.redirect(`${siteUrl()}#/integrations?youtube=${status}`, 302);
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const googleError = url.searchParams.get("error");

  if (googleError) {
    // User declined consent, or Google reported a problem before ever
    // issuing a code - nothing to exchange or clean up.
    return redirectTo(googleError === "access_denied" ? "denied" : "error");
  }
  if (!code || !state) {
    return redirectTo("error");
  }

  const admin = createAdminClient();

  // Atomically consume the state: a single delete...returning means at
  // most one concurrent request can ever get a row back for a given state
  // value, which is what makes replay impossible even under a race, not
  // just unlikely.
  const { data: stateRow, error: stateError } = await admin
    .from("oauth_states")
    .delete()
    .eq("state", state)
    .eq("provider", "youtube")
    .gt("expires_at", new Date().toISOString())
    .select("user_id")
    .maybeSingle();

  if (stateError || !stateRow) {
    // Invalid, expired, or already-consumed state - never proceed unless it
    // resolves to exactly one row this function itself issued.
    return redirectTo("error");
  }
  const userId = stateRow.user_id as string;

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const redirectUri = Deno.env.get("GOOGLE_OAUTH_REDIRECT_URI");
  if (!clientId || !clientSecret || !redirectUri) {
    return redirectTo("error");
  }

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
  } catch {
    // Network failure talking to Google - fail safe, never surface the
    // detail to the browser.
    return redirectTo("error");
  }

  if (!tokenResponse.ok) {
    // Deliberately not logging the response body here or anywhere below:
    // it's not routinely worth capturing OAuth exchange traffic in
    // production logs, and this keeps that discipline structural rather
    // than a habit to remember.
    return redirectTo("error");
  }

  const tokens = (await tokenResponse.json()) as TokenResponse;
  if (!tokens.access_token) {
    return redirectTo("error");
  }

  // The public "is this connected" record - never the tokens themselves.
  // platform_user_id/display_name are left null on purpose: resolving the
  // real channel identity requires a YouTube Data API call, which is
  // Phase 3D's job, not this one. Never invent a placeholder value here.
  const { data: connectedAccount, error: accountError } = await admin
    .from("connected_accounts")
    .upsert(
      { user_id: userId, platform: "youtube", status: "connected" },
      { onConflict: "user_id,platform" },
    )
    .select("id")
    .single();

  if (accountError || !connectedAccount) {
    return redirectTo("error");
  }

  // Reconnecting without a fresh refresh_token (Google omits it when
  // consent wasn't re-prompted) must not blow away a refresh_token this
  // user already granted - only overwrite it when Google actually sent a
  // new one.
  const { data: existingCredential } = await admin
    .from("connected_account_credentials")
    .select("refresh_token")
    .eq("connected_account_id", connectedAccount.id)
    .maybeSingle();

  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
    : null;

  const { error: credentialError } = await admin
    .from("connected_account_credentials")
    .upsert(
      {
        connected_account_id: connectedAccount.id,
        user_id: userId,
        provider: "youtube",
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? existingCredential?.refresh_token ?? null,
        token_type: tokens.token_type ?? null,
        expires_at: expiresAt,
        scope: tokens.scope ?? null,
      },
      { onConflict: "connected_account_id" },
    );

  if (credentialError) {
    return redirectTo("error");
  }

  return redirectTo("connected");
});
