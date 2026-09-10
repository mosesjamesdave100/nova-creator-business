// Shared, non-secret constants for the YouTube OAuth flow. The client
// secret is read directly from Deno.env inside youtube-oauth-callback only
// - it is never imported or re-exported through this module, and nothing
// here ever touches it.

export const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

// Read-only, minimum-privilege scope for Phase 3 - see the Phase 3
// readiness report for why yt-analytics.readonly and anything broader is
// deliberately excluded until a later phase actually needs it.
export const YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube.readonly";

export const OAUTH_STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function siteUrl(): string {
  return Deno.env.get("NOVA_SITE_URL") ?? "https://mosesjamesdave100.github.io/nova-creator-business/";
}

// Cryptographically random, URL-safe state token - bound server-side to the
// authenticated user in oauth_states. Nothing derived from or trusting
// anything the client supplies.
export function generateState(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
