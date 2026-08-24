// MOCK adapter. Swap the bodies below for real Instagram Graph API calls
// (OAuth, business account required) - callers already `await` these, so no
// call site changes when that happens.
import { mockDelay } from "../shared";
import { PLATFORMS } from "../../data/platforms";
import { audiencePlatforms } from "../../data/audience";
import { content } from "../../data/content";
import { CONNECTIONS, CONNECTION_STATE } from "../../data/connections";

const meta = PLATFORMS.instagram;

export async function getConnectionStatus() {
  await mockDelay();
  const conn = CONNECTIONS.instagram;
  return { ...meta, ...conn, connected: conn.state === CONNECTION_STATE.CONNECTED };
}

export async function getChannelStats() {
  await mockDelay();
  const platform = audiencePlatforms.find((p) => p.id === "instagram");
  return {
    followers: platform.followers,
    followersDeltaPct: platform.followersDeltaPct,
    viewsLast30d: platform.views30d,
    engagementRatePct: platform.engagementRatePct,
  };
}

export async function getRecentPosts(limit = 10) {
  await mockDelay();
  return content.filter((c) => c.platform === "instagram").slice(0, limit);
}
