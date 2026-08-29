// The Overview page's Quick Actions row. Each action is a real navigation,
// not a decorative button - `openForm: true` tells the destination page to
// deep-link straight into its create-flow via router state (see
// ContentPlannerPage/SponsorshipsPage), so the action actually does
// something instead of just landing on a page.
export const quickActions = [
  { id: "new-content", label: "New Content", icon: "content", to: "/content-planner", state: { openForm: true } },
  { id: "add-brand-deal", label: "Add Brand Deal", icon: "sponsors", to: "/sponsorships", state: { openForm: true } },
  { id: "create-product", label: "Create Product", icon: "bag", to: "/shop", state: { openForm: true } },
  { id: "schedule-post", label: "Schedule Post", icon: "calendar", to: "/content-planner", state: { openForm: true } },
  { id: "create-media-kit", label: "Create Media Kit", icon: "mediaKit", to: "/media-kit" },
  { id: "view-analytics", label: "View Analytics", icon: "analytics", to: "/analytics" },
];
