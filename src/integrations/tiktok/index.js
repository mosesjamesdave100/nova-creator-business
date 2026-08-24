// MOCK adapter. Swap the bodies below for real TikTok Display API / Content
// Posting API calls (OAuth) - callers already `await` these, so no call
// site changes when that happens.
import { mockDelay } from "../shared";
import { PLATFORMS } from "../../data/platforms";
import { audiencePlatforms } from "../../data/audience";
import { content } from "../../data/content";
import { CONNECTIONS, CONNECTION_STATE } from "../../data/connections";

const meta = PLATFORMS.tiktok;

export async function getConnectionStatus() {
  await mockDelay();
  const conn = CONNECTIONS.tiktok;
  return { ...meta, ...conn, connected: conn.state === CONNECTION_STATE.CONNECTED };
}

export async function getChannelStats() {
  await mockDelay();
  const platform = audiencePlatforms.find((p) => p.id === "tiktok");
  return {
    followers: platform.followers,
    followersDeltaPct: platform.followersDeltaPct,
    viewsLast30d: platform.views30d,
    engagementRatePct: platform.engagementRatePct,
  };
}

export async function getRecentVideos(limit = 10) {
  await mockDelay();
  return content.filter((c) => c.platform === "tiktok").slice(0, limit);
}
