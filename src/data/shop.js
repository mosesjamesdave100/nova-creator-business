// Store/product data. A real integration swaps this for a Shopify (or
// similar) Admin API client - products, inventory levels and orders all come
// from there; revenue/order aggregates would be recomputed from that feed
// rather than hand-summed like the mock below.
import { mulberry32 } from "./random";

function buildSparkline(seed, trendPct) {
  const random = mulberry32(seed);
  const direction = trendPct >= 0 ? 1 : -1;
  let value = 0.4;
  return Array.from({ length: 10 }, () => {
    value += direction * (0.02 + random() * 0.05) - random() * 0.02;
    value = Math.max(0.08, Math.min(0.95, value));
    return Math.round(value * 100) / 100;
  });
}

const RAW_PRODUCTS = [
  {
    id: "hoodie",
    name: "NOVA Hoodie (Black)",
    category: "Apparel",
    icon: "bag",
    price: 68,
    inventory: 142,
    inventoryStatus: "In stock",
    revenue30d: 1028,
    orders30d: 38,
    trendPct: 14,
  },
  {
    id: "creator-pack",
    name: "Creator Pack",
    category: "Digital",
    icon: "download",
    price: 29,
    inventory: null,
    inventoryStatus: "In stock",
    revenue30d: 770,
    orders30d: 27,
    trendPct: 6,
  },
  {
    id: "overlay-pack",
    name: "Stream Overlay Pack",
    category: "Digital",
    icon: "download",
    price: 19,
    inventory: null,
    inventoryStatus: "In stock",
    revenue30d: 600,
    orders30d: 33,
    trendPct: -3,
  },
  {
    id: "cap",
    name: "NOVA Cap",
    category: "Apparel",
    icon: "bag",
    price: 32,
    inventory: 18,
    inventoryStatus: "Low stock",
    revenue30d: 384,
    orders30d: 12,
    trendPct: 9,
  },
  {
    id: "wallpaper-pack",
    name: "Digital Wallpaper Pack",
    category: "Digital",
    icon: "download",
    price: 8,
    inventory: null,
    inventoryStatus: "In stock",
    revenue30d: 112,
    orders30d: 14,
    trendPct: 22,
  },
  {
    id: "tee",
    name: "NOVA Tee (White)",
    category: "Apparel",
    icon: "bag",
    price: 34,
    inventory: 0,
    inventoryStatus: "Out of stock",
    revenue30d: 0,
    orders30d: 0,
    trendPct: -100,
  },
];

export const totalRevenue30d = RAW_PRODUCTS.reduce((sum, p) => sum + p.revenue30d, 0);
export const totalOrders30d = RAW_PRODUCTS.reduce((sum, p) => sum + p.orders30d, 0);

// Storefront visits, the denominator for conversion rate. A real integration
// pulls this from Shopify Analytics (or a link-in-bio/storefront tool);
// mocked here as a plain number since NOVA doesn't host the storefront itself.
export const storeVisits30d = 4150;
export const conversionRatePct = (totalOrders30d / storeVisits30d) * 100;
export const conversionRateDeltaPct = 18;

export const products = RAW_PRODUCTS.map((p, i) => ({
  ...p,
  revenueSharePct: totalRevenue30d ? Math.round((p.revenue30d / totalRevenue30d) * 100) : 0,
  sparkline: buildSparkline(300 + i, p.trendPct),
}));

export const bestSellers = [...products].sort((a, b) => b.revenue30d - a.revenue30d).slice(0, 3);

export const recentOrders = [
  { id: "#10482", product: "NOVA Hoodie (Black)", amount: 65.0, status: "Fulfilled", timestamp: "12 min ago" },
  { id: "#10481", product: "Stream Overlay Pack", amount: 19.0, status: "Fulfilled", timestamp: "1 hr ago" },
  { id: "#10480", product: "Creator Pack", amount: 29.0, status: "Processing", timestamp: "3 hr ago" },
  { id: "#10479", product: "NOVA Cap", amount: 32.0, status: "Fulfilled", timestamp: "6 hr ago" },
  { id: "#10478", product: "NOVA Hoodie (Black)", amount: 65.0, status: "Refunded", timestamp: "1 day ago" },
];
