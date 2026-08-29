// Global search index. A real search would query each provider/data source
// live (or a server-side index); for now this is built once from the same
// data modules every page already reads, so a result can never point
// somewhere stale relative to what the app itself shows.
import { NAV_ITEMS } from "../dashboard/navigation";
import { topContent } from "./content";
import { sponsorships } from "./sponsorships";
import { products } from "./shop";
import { discordServer } from "./community";
import { insights } from "./aiInsights";
import { sources as revenueSources } from "./revenue";
import { formatCompactNumber } from "./format";

export const SEARCH_GROUPS = {
  page: "Pages",
  content: "Content",
  brandDeal: "Brand Deals",
  product: "Products",
  community: "Community",
  insight: "Insights",
  revenue: "Revenue",
  settings: "Settings",
};

function buildIndex() {
  const entries = [];

  for (const item of NAV_ITEMS) {
    entries.push({
      id: `page-${item.id}`,
      group: "page",
      icon: item.icon,
      title: item.label,
      subtitle: "Go to page",
      to: item.path,
    });
  }

  for (const item of topContent) {
    entries.push({
      id: `content-${item.id}`,
      group: "content",
      icon: "content",
      title: item.title,
      subtitle: `${item.platform} · ${formatCompactNumber(item.views)} views`,
      to: "/analytics",
    });
  }

  for (const deal of sponsorships) {
    entries.push({
      id: `deal-${deal.id}`,
      group: "brandDeal",
      icon: "sponsors",
      title: deal.brand,
      subtitle: deal.campaign ? `${deal.campaign} · ${deal.stage}` : deal.stage,
      to: "/sponsorships",
    });
  }

  for (const product of products) {
    entries.push({
      id: `product-${product.id}`,
      group: "product",
      icon: product.icon,
      title: product.name,
      subtitle: product.category,
      to: "/shop",
    });
  }

  entries.push({
    id: "community-discord",
    group: "community",
    icon: "community",
    title: "Community",
    subtitle: `${formatCompactNumber(discordServer.memberCount)} members on Discord`,
    to: "/community",
  });

  for (const insight of insights) {
    entries.push({
      id: `insight-${insight.id}`,
      group: "insight",
      icon: "sparkle",
      title: insight.title,
      subtitle: insight.category,
      to: "/insights",
    });
  }

  for (const source of revenueSources) {
    entries.push({
      id: `revenue-${source.id}`,
      group: "revenue",
      icon: "revenue",
      title: source.label,
      subtitle: "Revenue source",
      to: "/revenue",
    });
  }

  for (const label of ["Account", "Billing", "Notification preferences", "Team"]) {
    entries.push({
      id: `settings-${label}`,
      group: "settings",
      icon: "settings",
      title: label,
      subtitle: "Settings",
      to: "/settings",
    });
  }

  return entries;
}

export const searchIndex = buildIndex();
