// MOCK adapter. Swap the bodies below for real Twitch Helix API calls
// (OAuth) - callers already `await` these, so no call site changes when
// that happens.
import { mockDelay } from "../shared";
import { PLATFORMS } from "../../data/platforms";
import { audiencePlatforms } from "../../data/audience";
import { content } from "../../data/content";
import { sources } from "../../data/revenue";
import { liveStatus } from "../../data/mockData";
import { CONNECTIONS, CONNECTION_STATE } from "../../data/connections";

const meta = PLATFORMS.twitch;

export async function getConnectionStatus() {
  await mockDelay();
  const conn = CONNECTIONS.twitch;
  return { ...meta, ...conn, connected: conn.state === CONNECTION_STATE.CONNECTED };
}

export async function getChannelStats() {
  await mockDelay();
  const platform = audiencePlatforms.find((p) => p.id === "twitch");
  return {
    followers: platform.followers,
    followersDeltaPct: platform.followersDeltaPct,
    viewsLast30d: platform.views30d,
    engagementRatePct: platform.engagementRatePct,
  };
}

export async function getLiveStatus() {
  await mockDelay(150);
  return liveStatus.platform === "Twitch" ? liveStatus : { isLive: false, platform: "Twitch" };
}

export async function getRecentClips(limit = 10) {
  await mockDelay();
  return content.filter((c) => c.platform === "twitch" && c.format === "clip").slice(0, limit);
}

export async function getSubsAndBitsRevenue() {
  await mockDelay();
  return sources.find((s) => s.id === "twitch");
}
