// Barrel: every provider adapter, for the Integrations page (and the
// marketing "Connect Your Platforms" teaser) to render as one list. Each
// module's `getConnectionStatus()` returns the same shape
// ({ id, name, brandColor, connected, accountLabel }) so callers never
// special-case any one provider.
import * as youtube from "./youtube";
import * as twitch from "./twitch";
import * as tiktok from "./tiktok";
import * as instagram from "./instagram";
import * as discord from "./discord";
import * as shopify from "./shopify";
import * as stripe from "./stripe";

export const PROVIDERS = [
  { key: "youtube", module: youtube },
  { key: "twitch", module: twitch },
  { key: "tiktok", module: tiktok },
  { key: "instagram", module: instagram },
  { key: "discord", module: discord },
  { key: "shopify", module: shopify },
  { key: "stripe", module: stripe },
];
