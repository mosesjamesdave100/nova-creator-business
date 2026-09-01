// Config for the onboarding wizard's selectable options. Plain config, not
// mock analytics data, but kept here for the same reason as everything else
// in this folder: the wizard components render this list, they don't
// hardcode it inline.

export const CREATOR_CATEGORIES = [
  "Gaming",
  "Education",
  "Finance",
  "Entertainment",
  "Lifestyle",
  "Technology",
  "Fitness",
  "Commentary",
  "Music",
  "Other",
];

export const TIMEZONES = [
  "America/Chicago (CST)",
  "America/New_York (EST)",
  "America/Los_Angeles (PST)",
  "America/Denver (MST)",
  "Europe/London (GMT)",
  "UTC",
];

export const CURRENCIES = ["USD ($)", "EUR (€)", "GBP (£)", "CAD ($)", "AUD ($)"];

export const CREATOR_GOALS = [
  { id: "audience", label: "Grow my audience", detail: "Reach more viewers across platforms", icon: "trendingUp" },
  { id: "revenue", label: "Increase revenue", detail: "Grow ad revenue, memberships and merch", icon: "revenue" },
  { id: "sponsorships", label: "Find sponsorships", detail: "Land more brand deals", icon: "sponsors" },
  { id: "content", label: "Improve content", detail: "Understand what to make next", icon: "analytics" },
  { id: "community", label: "Build my community", detail: "Grow a paid, engaged community", icon: "community" },
  { id: "products", label: "Sell products", detail: "Grow merch and digital product sales", icon: "bag" },
  { id: "understand-audience", label: "Understand my audience", detail: "See who's watching and what they want", icon: "memberships" },
];
