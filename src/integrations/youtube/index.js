// MOCK adapter. Swap the bodies below for real YouTube Data API v3 /
// YouTube Analytics API calls (OAuth) - callers already `await` these, so no
// call site changes when that happens.
import { mockDelay } from "../shared";
import { PLATFORMS } from "../../data/platforms";
import { audiencePlatforms } from "../../data/audience";
import { content } from "../../data/content";
import { sources } from "../../data/revenue";
import { CONNECTIONS, CONNECTION_STATE } from "../../data/connections";

const meta = PLATFORMS.youtube;

export async function getConnectionStatus() {
  await mockDelay();
  const conn = CONNECTIONS.youtube;
  return { ...meta, ...conn, connected: conn.state === CONNECTION_STATE.CONNECTED };
}

export async function getChannelStats() {
  await mockDelay();
  const platform = audiencePlatforms.find((p) => p.id === "youtube");
  return {
    followers: platform.followers,
    followersDeltaPct: platform.followersDeltaPct,
    viewsLast30d: platform.views30d,
    engagementRatePct: platform.engagementRatePct,
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
