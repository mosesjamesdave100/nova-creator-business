// Overview-page mock data. This is the aggregated, glanceable slice; the
// fuller domain models each section drills into live in their own modules:
//   audience.js       -> per-platform followers/views/engagement + history
//   content.js        -> the content library (videos/shorts/clips/posts)
//   revenue.js        -> full business revenue by source + history
//   sponsorships.js   -> brand deal tracker
//   shop.js           -> products, inventory, orders
//   aiInsights.js     -> recommendations computed from content.js
//   ../integrations/* -> mock provider adapters (the eventual API boundary)
//
// `products` and `audience` below are intentionally derived FROM shop.js and
// audience.js (not hand-duplicated), so the Overview snapshot can never drift
// out of sync with the fuller pages. `revenue`/`revenueSources` are a
// simpler, separate direct-to-fan cut (store + memberships + digital + tips)
// kept as its own smaller figure - see revenue.js's header comment for why
// that total differs from the full Revenue page's.
import { dayLabel, monthLabel, mulberry32 } from "./random";
import {
  audiencePlatforms,
  totalFollowers,
  totalFollowersDeltaPct,
  blendedEngagementRatePct,
  blendedEngagementDeltaPct,
} from "./audience";
import { bestSellers } from "./shop";
import { formatCompactNumber, currency } from "./format";

export const creator = {
  name: "NOVA",
};

// 12-point relative trend line for a KPI's stat-tile sparkline, drifting
// toward `deltaPct`'s sign so the shape agrees with the printed delta.
function buildSparkline(seed, deltaPct) {
  const random = mulberry32(seed);
  const direction = deltaPct >= 0 ? 1 : -1;
  let value = 0.4;
  return Array.from({ length: 12 }, () => {
    value += direction * (0.02 + random() * 0.05) - random() * 0.02;
    value = Math.max(0.08, Math.min(0.95, value));
    return Math.round(value * 100) / 100;
  });
}

export const kpiComparisonLabel = "vs last 30 days";

export const kpis = [
  {
    id: "revenue",
    label: "REVENUE",
    icon: "revenue",
    rawValue: 4280.45,
    format: (n) => currency.format(n),
    deltaPct: 18.4,
    sparkline: buildSparkline(101, 18.4),
  },
  {
    id: "orders",
    label: "ORDERS",
    icon: "bag",
    rawValue: 127,
    format: (n) => `${Math.round(n)}`,
    deltaPct: 12,
    sparkline: buildSparkline(102, 12),
  },
  {
    id: "members",
    label: "MEMBERS",
    icon: "users",
    rawValue: 342,
    format: (n) => `${Math.round(n)}`,
    deltaPct: 24,
    sparkline: buildSparkline(103, 24),
  },
  {
    id: "followers",
    label: "FOLLOWERS",
    icon: "analytics",
    rawValue: totalFollowers,
    format: (n) => formatCompactNumber(Math.round(n)),
    deltaPct: totalFollowersDeltaPct,
    sparkline: buildSparkline(104, totalFollowersDeltaPct),
  },
  {
    id: "engagement",
    label: "ENGAGEMENT",
    icon: "trendingUp",
    rawValue: blendedEngagementRatePct,
    format: (n) => `${n.toFixed(1)}%`,
    deltaPct: blendedEngagementDeltaPct,
    sparkline: buildSparkline(105, blendedEngagementDeltaPct),
  },
];

function buildCumulativeSeries({ days, endTotal, seed, dateFormatter }) {
  const random = mulberry32(seed);
  // Slightly front-loaded random weights so the curve isn't a straight ramp.
  const weights = Array.from({ length: days }, () => 0.6 + random() * 0.8);
  const weightSum = weights.reduce((a, b) => a + b, 0);

  let running = 0;
  const points = weights.map((weight, i) => {
    running += (weight / weightSum) * endTotal;
    return {
      date: dateFormatter(i),
      value: Math.round(running * 100) / 100,
    };
  });
  // Force exact match on the final point, rounding drift aside.
  points[points.length - 1].value = endTotal;
  return points;
}

// A simpler direct-to-fan revenue cut (store + memberships + digital + tips)
// for the Overview snapshot. See revenue.js for the fuller, larger
// business-wide model (adds ad revenue and sponsorships) used on the Revenue
// page - the two intentionally show different totals, same as a real
// business's "storefront revenue" widget vs. its full P&L would.
export const revenue = {
  ranges: {
    "7d": {
      label: "Last 7 days",
      total: 1084.2,
      deltaPct: 9.2,
      points: buildCumulativeSeries({ days: 7, endTotal: 1084.2, seed: 7, dateFormatter: (i) => dayLabel(i, 7) }),
    },
    "30d": {
      label: "Last 30 days",
      total: 4280.45,
      deltaPct: 18.4,
      points: buildCumulativeSeries({ days: 30, endTotal: 4280.45, seed: 30, dateFormatter: (i) => dayLabel(i, 30) }),
    },
    "90d": {
      label: "Last 90 days",
      total: 11540.9,
      deltaPct: 34.7,
      points: buildCumulativeSeries({ days: 90, endTotal: 11540.9, seed: 90, dateFormatter: (i) => dayLabel(i, 90) }),
    },
    "12m": {
      label: "Last 12 months",
      total: 42360.75,
      deltaPct: 112.6,
      points: buildCumulativeSeries({
        days: 12,
        endTotal: 42360.75,
        seed: 12,
        dateFormatter: (i) => monthLabel(i, 12),
      }),
    },
  },
  defaultRange: "30d",
};

// Fixed categorical order, validated for CVD safety against the dashboard's
// dark surface (#111111) via the dataviz skill's palette validator. Store's
// hue deliberately echoes the brand accent (it's the largest, "hero" source);
// the other three are a chart-safe violet, cyan and magenta. Worst adjacent
// CVD pair sits in the 6-8 warn band, which is why every slice also carries a
// direct label below, not color alone.
export const revenueSources = {
  total: 4280.45,
  items: [
    { id: "store", label: "Store", pct: 50, color: "#6f9e2a" },
    { id: "memberships", label: "Memberships", pct: 30, color: "#8570db" },
    { id: "digital", label: "Digital Products", pct: 15, color: "#2fa0c9" },
    { id: "tips", label: "Tips & Donations", pct: 5, color: "#cc5590" },
  ],
};

export const activity = [
  {
    id: 1,
    icon: "bag",
    title: "New merch order",
    detail: "NOVA Hoodie (Black), $65.00",
    timestamp: "12 min ago",
  },
  {
    id: 2,
    icon: "users",
    title: "3 new members joined",
    detail: "INSIDER Tier",
    timestamp: "48 min ago",
  },
  {
    id: 3,
    icon: "download",
    title: "Digital product sold",
    detail: "Stream Overlay Pack",
    timestamp: "2 hr ago",
  },
  {
    id: 4,
    icon: "youtube",
    title: "YouTube audience",
    detail: "+4.2% new subscribers",
    timestamp: "5 hr ago",
  },
  {
    id: 5,
    icon: "payout",
    title: "Payout sent",
    detail: "$1,240.00",
    timestamp: "1 day ago",
  },
];

// Top 3 by revenue, derived from shop.js so Overview never drifts from Shop.
export const products = bestSellers.map((p) => ({
  id: p.id,
  name: p.name,
  icon: p.icon,
  revenue: p.revenue30d,
  orders: p.orders30d,
  revenueSharePct: p.revenueSharePct,
  trendPct: p.trendPct,
  sparkline: p.sparkline,
}));

const PLATFORM_SHORT_LABEL = { youtube: "YT", twitch: "Twitch", tiktok: "TikTok", instagram: "IG" };

// Derived from audience.js so Overview's totals can't drift from Analytics.
export const audience = {
  total: formatCompactNumber(totalFollowers),
  deltaPct: totalFollowersDeltaPct,
  platforms: audiencePlatforms.map((p) => ({
    id: p.id,
    label: p.name,
    shortLabel: PLATFORM_SHORT_LABEL[p.id],
    value: formatCompactNumber(p.followers),
  })),
};

export const liveStatus = {
  isLive: true,
  platform: "Twitch",
  watching: "12.4K",
};

export const quickActions = [
  { id: "add-product", label: "Add Product" },
  { id: "create-drop", label: "Create Drop" },
  { id: "new-post", label: "New Post" },
  { id: "go-live", label: "Go Live" },
  { id: "view-analytics", label: "View Analytics" },
];
