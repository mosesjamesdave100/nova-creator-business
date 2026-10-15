// Returns the signed-in NOVA user's real YouTube channel numbers, read with
// the OAuth tokens youtube-oauth-callback stored. The tokens never leave
// this function: connected_account_credentials has no RLS policy for the
// browser's roles, so only this service-role context can read them, and the
// response carries channel stats only.
//
// Uses the YouTube Data API v3 under the youtube.readonly scope already
// granted at connect time. That scope has no time-windowed analytics (views
// in the last 30 days, subscriber deltas - those need yt-analytics.readonly),
// so this returns lifetime totals plus engagement across recent uploads, and
// leaves the windowed figures null rather than inventing them.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.4";
import { createAdminClient } from "../_shared/supabaseAdmin.ts";
import { corsHeaders, handlePreflight } from "../_shared/cors.ts";
import { GOOGLE_TOKEN_ENDPOINT } from "../_shared/googleOAuth.ts";

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";
const RECENT_VIDEO_LIMIT = 10;
// Refresh a little before Google's stated expiry so a token can't lapse
// between this check and the API calls below.
const EXPIRY_SKEW_MS = 60 * 1000;

type Credential = {
  id: string;
  connected_account_id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
};

class ReauthRequired extends Error {}

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  if (req.method !== "GET") {
    return json(req, { error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) {
    return json(req, { error: "not_configured" }, 500);
  }

  // Same identity check as youtube-oauth-start: the caller's own JWT,
  // verified by Supabase's auth server, is the only user id trusted here.
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await callerClient.auth.getUser();
  if (userError || !userData?.user) {
    return json(req, { error: "not_authenticated" }, 401);
  }
  const userId = userData.user.id;

  const admin = createAdminClient();
  const { data: credential, error: credentialError } = await admin
    .from("connected_account_credentials")
    .select("id, connected_account_id, access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .eq("provider", "youtube")
    .maybeSingle();

  if (credentialError) {
    return json(req, { error: "unavailable" }, 502);
  }
  if (!credential) {
    return json(req, { error: "not_connected" }, 404);
  }

  try {
    const stats = await withFreshToken(admin, credential as Credential, fetchChannelStats);
    if (!stats) {
      // Valid token, but the Google account has no YouTube channel.
      return json(req, { error: "no_channel" }, 404);
    }

    // Fill in the channel identity youtube-oauth-callback deliberately left
    // null, so the Integrations page can label the account. Best-effort: a
    // failure here doesn't affect the stats being returned.
    await admin
      .from("connected_accounts")
      .update({ platform_user_id: stats.channel.id, display_name: stats.channel.handle ?? stats.channel.title })
      .eq("id", credential.connected_account_id);

    return json(req, stats, 200);
  } catch (err) {
    if (err instanceof ReauthRequired) {
      return json(req, { error: "reauth_required" }, 409);
    }
    return json(req, { error: "unavailable" }, 502);
  }
});

// Runs `fn` with a valid access token, refreshing first when the stored one
// is expired, and once more if Google rejects it anyway (revoked early,
// clock skew).
async function withFreshToken<T>(
  admin: ReturnType<typeof createAdminClient>,
  credential: Credential,
  fn: (accessToken: string) => Promise<T>,
): Promise<T> {
  let accessToken = credential.access_token;
  const expiresAt = credential.expires_at ? Date.parse(credential.expires_at) : 0;
  if (expiresAt - EXPIRY_SKEW_MS < Date.now()) {
    accessToken = await refreshAccessToken(admin, credential);
  }

  try {
    return await fn(accessToken);
  } catch (err) {
    if (!(err instanceof ReauthRequired) || accessToken !== credential.access_token) throw err;
    accessToken = await refreshAccessToken(admin, credential);
    return await fn(accessToken);
  }
}

async function refreshAccessToken(
  admin: ReturnType<typeof createAdminClient>,
  credential: Credential,
): Promise<string> {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  if (!credential.refresh_token) throw new ReauthRequired();
  if (!clientId || !clientSecret) throw new Error("Missing Google OAuth configuration");

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: credential.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  // A 400/401 here means the refresh token was revoked or expired - only
  // reconnecting can fix that. Body deliberately not logged, as in the
  // callback.
  if (response.status === 400 || response.status === 401) throw new ReauthRequired();
  if (!response.ok) throw new Error("Token refresh failed");

  const tokens = (await response.json()) as { access_token?: string; expires_in?: number; refresh_token?: string };
  if (!tokens.access_token) throw new Error("Token refresh returned no access token");

  await admin
    .from("connected_account_credentials")
    .update({
      access_token: tokens.access_token,
      expires_at: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
      // Google may rotate the refresh token; keep the old one otherwise.
      ...(tokens.refresh_token ? { refresh_token: tokens.refresh_token } : {}),
    })
    .eq("id", credential.id);

  return tokens.access_token;
}

async function youtubeGet(path: string, params: Record<string, string>, accessToken: string) {
  const response = await fetch(`${YOUTUBE_API}/${path}?${new URLSearchParams(params)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (response.status === 401) throw new ReauthRequired();
  if (!response.ok) throw new Error(`YouTube API ${path} failed with ${response.status}`);
  return await response.json();
}

function toNumber(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function fetchChannelStats(accessToken: string) {
  const channels = await youtubeGet(
    "channels",
    { part: "snippet,statistics,contentDetails", mine: "true" },
    accessToken,
  );
  const channel = channels.items?.[0];
  if (!channel) return null;

  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
  let recentVideos: Array<{
    id: string;
    title: string;
    publishedAt: string;
    thumbnailUrl: string | null;
    views: number | null;
    likes: number | null;
    comments: number | null;
  }> = [];

  if (uploadsPlaylistId) {
    const playlist = await youtubeGet(
      "playlistItems",
      { part: "contentDetails", playlistId: uploadsPlaylistId, maxResults: String(RECENT_VIDEO_LIMIT) },
      accessToken,
    );
    const ids = (playlist.items ?? []).map((item: { contentDetails: { videoId: string } }) => item.contentDetails.videoId);
    if (ids.length > 0) {
      const videos = await youtubeGet("videos", { part: "snippet,statistics", id: ids.join(",") }, accessToken);
      recentVideos = (videos.items ?? []).map((video: any) => ({
        id: video.id,
        title: video.snippet?.title ?? "",
        publishedAt: video.snippet?.publishedAt ?? null,
        thumbnailUrl: video.snippet?.thumbnails?.medium?.url ?? video.snippet?.thumbnails?.default?.url ?? null,
        views: toNumber(video.statistics?.viewCount),
        likes: toNumber(video.statistics?.likeCount),
        comments: toNumber(video.statistics?.commentCount),
      }));
    }
  }

  // Likes + comments per view across recent uploads - the closest
  // engagement-rate figure the Data API offers without Analytics scope.
  const recentViews = recentVideos.reduce((sum, v) => sum + (v.views ?? 0), 0);
  const recentInteractions = recentVideos.reduce((sum, v) => sum + (v.likes ?? 0) + (v.comments ?? 0), 0);
  const engagementRatePct = recentViews > 0 ? Math.round((recentInteractions / recentViews) * 1000) / 10 : null;

  const statistics = channel.statistics ?? {};
  return {
    channel: {
      id: channel.id as string,
      title: (channel.snippet?.title ?? "") as string,
      handle: (channel.snippet?.customUrl ?? null) as string | null,
      thumbnailUrl: (channel.snippet?.thumbnails?.default?.url ?? null) as string | null,
    },
    subscribers: statistics.hiddenSubscriberCount ? null : toNumber(statistics.subscriberCount),
    totalViews: toNumber(statistics.viewCount),
    videoCount: toNumber(statistics.videoCount),
    engagementRatePct,
    recentVideos,
    fetchedAt: new Date().toISOString(),
  };
}

function json(req: Request, body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(req) },
  });
}
