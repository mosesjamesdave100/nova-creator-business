// Connection state for every provider NOVA can integrate with. This is the
// single source of truth for the Integrations page, and for the demo-mode
// banner that reminds creators none of this is a live connection yet. A real
// integration replaces this with actual OAuth session state read back from
// each provider, the shape (state + accountLabel + detail) stays the same so
// the UI doesn't change when that happens.
//
// Three states, not just on/off, because "connected" alone hides a real
// failure mode: a token can lapse or a permission can be revoked without the
// creator noticing until a sync silently stops.
//   connected       - actively syncing
//   needs_attention - was connected, but needs the creator to act
//   not_connected   - never connected
export const CONNECTION_STATE = {
  CONNECTED: "connected",
  NEEDS_ATTENTION: "needs_attention",
  NOT_CONNECTED: "not_connected",
};

export const CONNECTION_STATE_LABEL = {
  [CONNECTION_STATE.CONNECTED]: "Connected",
  [CONNECTION_STATE.NEEDS_ATTENTION]: "Needs attention",
  [CONNECTION_STATE.NOT_CONNECTED]: "Not connected",
};

export const CONNECTIONS = {
  youtube: { state: CONNECTION_STATE.CONNECTED, accountLabel: "@novaplays", lastSynced: "12 min ago" },
  twitch: { state: CONNECTION_STATE.CONNECTED, accountLabel: "novaplays", lastSynced: "12 min ago" },
  tiktok: {
    state: CONNECTION_STATE.NEEDS_ATTENTION,
    accountLabel: "@novaplays",
    detail: "Access expired. Reconnect to keep video stats syncing.",
  },
  instagram: { state: CONNECTION_STATE.NOT_CONNECTED, accountLabel: null },
  discord: { state: CONNECTION_STATE.CONNECTED, accountLabel: "NOVA Community", lastSynced: "2 min ago" },
  shopify: { state: CONNECTION_STATE.CONNECTED, accountLabel: "nova-store.myshopify.com", lastSynced: "1 hr ago" },
  stripe: { state: CONNECTION_STATE.CONNECTED, accountLabel: "acct_nova", lastSynced: "1 hr ago" },
};

// Whether the app is showing demo data or data from real connected accounts.
// Every provider above is mocked except YouTube, whose adapter returns live
// stats (tagged `source: "live"`) once the creator connects it. The rest of
// the dashboard is still demo data, so this stays true until more adapters
// go live.
export const DEMO_MODE = true;
