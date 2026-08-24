// Shared platform metadata. Two color roles, deliberately different:
//   brandColor  - the platform's real brand color, used only for small icon
//                 badges that are always paired with the platform name, so
//                 identity never rests on color alone.
//   chartColor  - the color used when a platform is a *chart mark* (the
//                 Analytics platform-comparison chart). Real brand colors
//                 (YouTube red vs Instagram pink, especially) fail the
//                 dataviz skill's CVD validator together, so chart marks use
//                 a validated 4-hue set instead (checked via
//                 scripts/validate_palette.js against this dashboard's
//                 #111111 surface, all-pairs, dark mode - passes with one
//                 pair in the 6-8 CVD warn band, mitigated by the chart's
//                 always-on legend).
export const PLATFORMS = {
  youtube: { id: "youtube", name: "YouTube", brandColor: "#FF0000", chartColor: "#cc5590" },
  twitch: { id: "twitch", name: "Twitch", brandColor: "#9146FF", chartColor: "#8570db" },
  tiktok: { id: "tiktok", name: "TikTok", brandColor: "#00F2EA", chartColor: "#2fa0c9" },
  instagram: { id: "instagram", name: "Instagram", brandColor: "#E1306C", chartColor: "#6f9e2a" },
  // Not chart-mark platforms (no analytics time series), so no chartColor -
  // brandColor only, always paired with the name.
  discord: { id: "discord", name: "Discord", brandColor: "#5865F2" },
  shopify: { id: "shopify", name: "Shopify", brandColor: "#95BF47" },
  stripe: { id: "stripe", name: "Stripe", brandColor: "#635BFF" },
};

export const PLATFORM_LIST = Object.values(PLATFORMS);

// The 7 providers NOVA can connect, in the fixed order used everywhere a
// "Connect your platforms" list appears (marketing teaser, Integrations page).
export const CONNECTABLE_PROVIDER_IDS = [
  "youtube",
  "twitch",
  "tiktok",
  "instagram",
  "discord",
  "shopify",
  "stripe",
];
