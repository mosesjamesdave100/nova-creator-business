// YouTube adapter. Live when the signed-in creator has connected YouTube
// (real numbers via the youtube-channel-stats Edge Function); otherwise the
// mock data below, so the demo dashboard keeps working for anyone who
// hasn't connected yet. Every result carries `source: "live" | "demo"` so
// the UI can label which one it's showing and never pass mock numbers off
// as real ones.
import { mockDelay } from "../shared";
import { PLATFORMS } from "../../data/platforms";
import { audiencePlatforms } from "../../data/audience";
import { content } from "../../data/content";
import { sources } from "../../data/revenue";
import { CONNECTIONS, CONNECTION_STATE } from "../../data/connections";
import { listConnectedAccounts } from "../../services/connectedAccountsService";
import { fetchYoutubeChannelStats } from "../../services/youtubeService";

const meta = PLATFORMS.youtube;

export async function getConnectionStatus() {
  await mockDelay();
  const conn = CONNECTIONS.youtube;
  return { ...meta, ...conn, connected: conn.state === CONNECTION_STATE.CONNECTED };
}

async function isYoutubeConnected(userId) {
  if (!userId) return false;
  const { accounts } = await listConnectedAccounts(userId);
  return accounts.some((a) => a.platform === "youtube" && a.status === "connected");
}

function demoChannelStats() {
  const platform = audiencePlatforms.find((p) => p.id === "youtube");
  return {
    source: "demo",
    error: null,
    channel: null,
    followers: platform.followers,
    followersDeltaPct: platform.followersDeltaPct,
    viewsLast30d: platform.views30d,
    totalViews: null,
    videoCount: null,
    engagementRatePct: platform.engagementRatePct,
    recentVideos: [],
  };
}

// Live figures come from the YouTube Data API under the read-only scope, which
// has no 30-day windows or subscriber deltas - those stay null rather than
// borrowing mock values. `followers` is null when the channel hides its
// subscriber count.
export async function getChannelStats(userId) {
  if (!(await isYoutubeConnected(userId))) {
    await mockDelay();
    return demoChannelStats();
  }

  const { stats, error } = await fetchYoutubeChannelStats();
  if (error) {
    return {
      source: "live",
      error,
      channel: null,
      followers: null,
      followersDeltaPct: null,
      viewsLast30d: null,
      totalViews: null,
      videoCount: null,
      engagementRatePct: null,
      recentVideos: [],
    };
  }
  return {
    source: "live",
    error: null,
    channel: stats.channel,
    followers: stats.subscribers,
    followersDeltaPct: null,
    viewsLast30d: null,
    totalViews: stats.totalViews,
    videoCount: stats.videoCount,
    engagementRatePct: stats.engagementRatePct,
    recentVideos: stats.recentVideos,
  };
}

export async function getRecentContent(limit = 10) {
  await mockDelay();
  return content.filter((c) => c.platform === "youtube").slice(0, limit);
}

export async function getAdRevenue() {
  await mockDelay();
  return sources.find((s) => s.id === "youtube");
}
