// Sidebar nav, shared across every dashboard route so active state and
// order stay consistent as more pages come online. Paths are flat/top-level
// (not nested under /dashboard) per the product's route architecture -
// DashboardLayout is a pathless layout route, so these are real top-level
// URLs sharing one shell.
export const NAV_ITEMS = [
  { id: "overview", label: "Overview", path: "/dashboard", icon: "overview" },
  { id: "analytics", label: "Analytics", path: "/analytics", icon: "content" },
  { id: "audience", label: "Audience", path: "/audience", icon: "memberships" },
  { id: "revenue", label: "Revenue", path: "/revenue", icon: "revenue" },
  { id: "sponsorships", label: "Brand Deals", path: "/sponsorships", icon: "sponsors" },
  { id: "shop", label: "Store", path: "/shop", icon: "store" },
  { id: "community", label: "Community", path: "/community", icon: "community" },
  { id: "content-planner", label: "Content Planner", path: "/content-planner", icon: "calendar" },
  { id: "insights", label: "Insights", path: "/insights", icon: "sparkle" },
  { id: "media-kit", label: "Media Kit", path: "/media-kit", icon: "mediaKit" },
  { id: "integrations", label: "Integrations", path: "/integrations", icon: "integrations" },
  { id: "settings", label: "Settings", path: "/settings", icon: "settings" },
];
