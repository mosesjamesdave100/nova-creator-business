// Discord community stats. A real integration replaces this with the
// Discord API (guild member counts, presence, recent messages via a bot).
import { buildTrendSeries, dayLabel } from "./random";

export const discordServer = {
  memberCount: 18420,
  onlineCount: 2260,
  memberDeltaPct: 6.4,
};

// The Community page's own overview cards. totalMembers deliberately reads
// straight off discordServer (the same number the Integrations page and
// global search show), the rest are this page's own stats.
export const communityOverview = {
  totalMembers: discordServer.memberCount,
  activeThisWeek: 8240,
  engagementRatePct: 7.8,
  newMembersCount: 642,
};

export const communityActivity = [
  { id: "ca-1", category: "Discussion", detail: 'New discussion started: "Best setup for streaming?"', time: "22 min ago" },
  { id: "ca-2", category: "Challenge", detail: "482 members joined the weekly challenge.", time: "1 hr ago" },
  { id: "ca-3", category: "Poll", detail: "Creator poll received 1,284 responses.", time: "3 hr ago" },
  { id: "ca-4", category: "Event", detail: "Community event scheduled for Friday.", time: "5 hr ago" },
  { id: "ca-5", category: "Discussion", detail: '42 replies on "Favorite clutch moments this season".', time: "1 day ago" },
];

const ENGAGEMENT_DAYS = 30;

export const communityEngagementSeries = {
  dates: Array.from({ length: ENGAGEMENT_DAYS }, (_, i) => dayLabel(i, ENGAGEMENT_DAYS)),
  values: buildTrendSeries({
    days: ENGAGEMENT_DAYS,
    start: 5.4,
    end: communityOverview.engagementRatePct,
    seed: 340,
    noise: 0.06,
  }),
};

// Member count over the same window, ending at today's memberCount and
// starting `newMembersCount` lower - the same +642 this page's overview
// card already shows, just spread across the period instead of one number.
export const communityMemberGrowthSeries = {
  dates: Array.from({ length: ENGAGEMENT_DAYS }, (_, i) => dayLabel(i, ENGAGEMENT_DAYS)),
  values: buildTrendSeries({
    days: ENGAGEMENT_DAYS,
    start: discordServer.memberCount - communityOverview.newMembersCount,
    end: discordServer.memberCount,
    seed: 471,
    noise: 0.01,
  }),
};
