// Full business revenue model for the Revenue dashboard page. Broader than
// the Overview page's simpler Store/Memberships/Digital/Tips snapshot (that
// one is a direct-to-fan cut, still shown as-is on Overview): this is revenue
// by platform source, the way a creator actually gets paid, and includes ad
// revenue and sponsorships the Overview snapshot doesn't itemize. A real
// integration replaces `sources` with calls into payment/platform APIs
// (YouTube Studio revenue, Twitch payouts, Stripe for sponsorships/store) and
// `ranges` with a time-series query against the same providers.
import { buildTrendSeries, dayLabel, monthLabel } from "./random";

// Only 4 distinct hues, reused (validated) from the platform/revenue-source
// palette elsewhere. Per the dataviz skill, an all-pairs categorical set
// tops out around 4-5 safe hues, past that "fold to Other" - so the two
// smallest sources use neutral grays (two lightness steps, still visually
// distinct, and this doubles as the standard "long tail" convention) instead
// of forcing a 6th hue that would collide with an existing one.
export const sources = [
  { id: "sponsorships", label: "Sponsorships", total: 6500.0, deltaPct: 22.8, color: "#2fa0c9" },
  { id: "youtube", label: "YouTube Ads", total: 2180.0, deltaPct: 9.4, color: "#cc5590" },
  { id: "merch", label: "Merch", total: 2140.23, deltaPct: 18.4, color: "#6f9e2a" },
  { id: "twitch", label: "Twitch Subs & Bits", total: 1340.0, deltaPct: 14.2, color: "#8570db" },
  { id: "memberships", label: "Memberships", total: 1284.14, deltaPct: 24.0, color: "#9a9a9a" },
  { id: "other", label: "Other (tips, affiliate)", total: 856.09, deltaPct: -4.1, color: "#555555" },
];

export const totalRevenue30d = sources.reduce((sum, s) => sum + s.total, 0);

function buildCumulativeSeries({ days, endTotal, seed, dateFormatter }) {
  const points = buildTrendSeries({ days, start: endTotal * 0.08, end: endTotal, seed, noise: 0.05 });
  // buildTrendSeries interpolates linearly between start/end which already
  // gives a rising curve; treat it directly as the cumulative series.
  return points.map((value, i) => ({ date: dateFormatter(i), value }));
}

export const ranges = {
  "7d": {
    label: "Last 7 days",
    total: 3620.5,
    deltaPct: 11.6,
    points: buildCumulativeSeries({ days: 7, endTotal: 3620.5, seed: 207, dateFormatter: (i) => dayLabel(i, 7) }),
  },
  "30d": {
    label: "Last 30 days",
    total: totalRevenue30d,
    deltaPct: 15.9,
    points: buildCumulativeSeries({
      days: 30,
      endTotal: totalRevenue30d,
      seed: 230,
      dateFormatter: (i) => dayLabel(i, 30),
    }),
  },
  "90d": {
    label: "Last 90 days",
    total: 38940.2,
    deltaPct: 27.3,
    points: buildCumulativeSeries({ days: 90, endTotal: 38940.2, seed: 290, dateFormatter: (i) => dayLabel(i, 90) }),
  },
  "12m": {
    label: "Last 12 months",
    total: 142380.6,
    deltaPct: 64.8,
    points: buildCumulativeSeries({
      days: 12,
      endTotal: 142380.6,
      seed: 212,
      dateFormatter: (i) => monthLabel(i, 12),
    }),
  },
};

export const defaultRange = "30d";

// A unified transactions feed across every revenue source - this is the
// canonical list; integrations/stripe's mock payout adapter reads its slice
// from here rather than keeping its own copy.
export const recentTransactions = [
  { id: "txn-1", type: "payout", label: "Stripe payout", amount: 1240.0, status: "Paid", timestamp: "1 day ago" },
  { id: "txn-2", type: "sponsorship", label: "Voltbar Energy, sponsorship payment", amount: 4200.0, status: "Paid", timestamp: "3 days ago" },
  { id: "txn-3", type: "order", label: "Store order, NOVA Hoodie (Black)", amount: 65.0, status: "Paid", timestamp: "4 days ago" },
  { id: "txn-4", type: "payout", label: "Stripe payout", amount: 980.5, status: "Paid", timestamp: "8 days ago" },
  { id: "txn-5", type: "sponsorship", label: "GripLine Peripherals, sponsorship payment", amount: 5400.0, status: "Paid", timestamp: "12 days ago" },
  { id: "txn-6", type: "payout", label: "Stripe payout", amount: 1105.2, status: "Paid", timestamp: "15 days ago" },
];
