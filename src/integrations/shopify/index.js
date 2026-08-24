// MOCK adapter. Swap the bodies below for real Shopify Admin API calls -
// callers already `await` these, so no call site changes when that happens.
import { mockDelay } from "../shared";
import { products, recentOrders, totalRevenue30d, totalOrders30d } from "../../data/shop";
import { PLATFORMS } from "../../data/platforms";
import { CONNECTIONS, CONNECTION_STATE } from "../../data/connections";

const meta = PLATFORMS.shopify;

export async function getConnectionStatus() {
  await mockDelay();
  const conn = CONNECTIONS.shopify;
  return { ...meta, ...conn, connected: conn.state === CONNECTION_STATE.CONNECTED };
}

export async function getProducts() {
  await mockDelay();
  return products;
}

export async function getOrders(limit = 10) {
  await mockDelay();
  return recentOrders.slice(0, limit);
}

export async function getStoreSummary() {
  await mockDelay();
  return { revenue30d: totalRevenue30d, orders30d: totalOrders30d };
}
