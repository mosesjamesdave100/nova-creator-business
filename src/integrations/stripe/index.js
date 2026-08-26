// MOCK adapter. Swap the bodies below for real Stripe API calls (a real
// integration would use this for memberships, digital products and payouts,
// while Shopify's own checkout usually handles store/merch) - callers
// already `await` these, so no call site changes when that happens.
import { mockDelay } from "../shared";
import { ranges, defaultRange, sources, recentTransactions } from "../../data/revenue";
import { PLATFORMS } from "../../data/platforms";
import { CONNECTIONS, CONNECTION_STATE } from "../../data/connections";

const meta = PLATFORMS.stripe;

export async function getConnectionStatus() {
  await mockDelay();
  const conn = CONNECTIONS.stripe;
  return { ...meta, ...conn, connected: conn.state === CONNECTION_STATE.CONNECTED };
}

export async function getRevenueSummary(rangeId = defaultRange) {
  await mockDelay();
  return ranges[rangeId];
}

export async function getMembershipRevenue() {
  await mockDelay();
  return sources.find((s) => s.id === "memberships");
}

export async function getRecentPayouts(limit = 5) {
  await mockDelay();
  return recentTransactions.filter((t) => t.type === "payout").slice(0, limit);
}
