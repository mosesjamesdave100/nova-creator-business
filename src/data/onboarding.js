// Config for the onboarding wizard's selectable options. Plain config, not
// mock analytics data, but kept here for the same reason as everything else
// in this folder: the wizard components render this list, they don't
// hardcode it inline.
export const CREATE_TYPES = [
  { id: "youtube", label: "YouTube", detail: "Long-form videos and Shorts", icon: "youtube" },
  { id: "twitch", label: "Twitch", detail: "Live streaming", icon: "play" },
  { id: "tiktok", label: "TikTok", detail: "Short-form video", icon: "sparkle" },
  { id: "instagram", label: "Instagram", detail: "Reels, posts and stories", icon: "users" },
  { id: "podcast", label: "Podcast", detail: "Audio, video podcasts", icon: "messages" },
  { id: "other", label: "Other", detail: "Something else entirely", icon: "content" },
];

export const GROWTH_FOCUS = [
  { id: "audience", label: "Audience", detail: "Reach more viewers across platforms", icon: "trendingUp" },
  { id: "revenue", label: "Revenue", detail: "Grow ad revenue, memberships and merch", icon: "revenue" },
  { id: "sponsorships", label: "Sponsorships", detail: "Land more brand deals", icon: "sponsors" },
  { id: "content", label: "Content", detail: "Understand what to make next", icon: "analytics" },
  { id: "community", label: "Community", detail: "Build a paid, engaged community", icon: "community" },
  { id: "everything", label: "Everything", detail: "All of the above", icon: "sparkle" },
];
