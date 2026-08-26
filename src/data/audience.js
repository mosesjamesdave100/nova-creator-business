// Audience analytics: per-platform current stats plus 90-day time series for
// followers, views and engagement. A real integration replaces each series
// with a call to that platform's analytics endpoint (YouTube Analytics API,
// Twitch Helix, TikTok Display API, Instagram Graph API).
import { buildTrendSeries, dayLabel } from "./random";
import { PLATFORMS } from "./platforms";

const SERIES_DAYS = 90;

export const seriesDates = Array.from({ length: SERIES_DAYS }, (_, i) => dayLabel(i, SERIES_DAYS));

const RAW_PLATFORMS = [
  {
    id: "youtube",
    followers: 54200,
    followersDeltaPct: 6.1,
    views30d: 812000,
    engagementRatePct: 4.8,
    followersSeed: 11,
    viewsSeed: 21,
    engagementSeed: 31,
  },
  {
    id: "twitch",
    followers: 32100,
    followersDeltaPct: 9.3,
    views30d: 410000,
    engagementRatePct: 6.2,
    followersSeed: 12,
    viewsSeed: 22,
    engagementSeed: 32,
  },
  {
    id: "tiktok",
    followers: 28800,
    followersDeltaPct: 11.2,
    views30d: 1250000,
    engagementRatePct: 8.9,
    followersSeed: 13,
    viewsSeed: 23,
    engagementSeed: 33,
  },
  {
    id: "instagram",
    followers: 13600,
    followersDeltaPct: 4.8,
    views30d: 96000,
    engagementRatePct: 3.1,
    followersSeed: 14,
    viewsSeed: 24,
    engagementSeed: 34,
  },
];

export const audiencePlatforms = RAW_PLATFORMS.map((p) => {
  const startFollowers = Math.round(p.followers / (1 + p.followersDeltaPct / 100));
  const followersSeries = buildTrendSeries({
    days: SERIES_DAYS,
    start: startFollowers,
    end: p.followers,
    seed: p.followersSeed,
    noise: 0.01,
  });
  const viewsSeries = buildTrendSeries({
    days: SERIES_DAYS,
    start: Math.round(p.views30d * 0.7),
    end: p.views30d,
    seed: p.viewsSeed,
    noise: 0.12,
  });
  const engagementSeries = buildTrendSeries({
    days: SERIES_DAYS,
    start: p.engagementRatePct * 0.85,
    end: p.engagementRatePct,
    seed: p.engagementSeed,
    noise: 0.08,
  });

  return {
    ...PLATFORMS[p.id],
    followers: p.followers,
    followersDeltaPct: p.followersDeltaPct,
    views30d: p.views30d,
    engagementRatePct: p.engagementRatePct,
    followersSeries,
    viewsSeries,
    engagementSeries,
  };
});

function sumSeries(key) {
  return Array.from({ length: SERIES_DAYS }, (_, i) =>
    audiencePlatforms.reduce((sum, p) => sum + p[key][i], 0)
  );
}

export const combinedSeries = {
  followers: sumSeries("followersSeries"),
  views: sumSeries("viewsSeries"),
  // Engagement is a rate, not a count, average rather than sum across platforms.
  engagement: Array.from(
    { length: SERIES_DAYS },
    (_, i) => audiencePlatforms.reduce((sum, p) => sum + p.engagementSeries[i], 0) / audiencePlatforms.length
  ),
};

// Relative audience "online-ness" by hour (0 = 12am ... 23 = 11pm), across
// all platforms. A real integration derives this from each platform's
// audience-activity endpoint (e.g. YouTube Analytics' "when your viewers
// are on YouTube"); this hand-authored curve just needs a believable evening
// peak for aiInsights.js's "best active window" to find.
export const audienceActivityByHour = [
  30, 26, 23, 21, 20, 21, 24, 28, 34, 40, 46, 50, 54, 57, 59, 61, 64, 68, 74, 82, 86, 80, 64, 42,
];

export const totalFollowers = audiencePlatforms.reduce((sum, p) => sum + p.followers, 0);
export const totalFollowersDeltaPct = 8.7;
export const totalViews30d = audiencePlatforms.reduce((sum, p) => sum + p.views30d, 0);
export const blendedEngagementRatePct =
  audiencePlatforms.reduce((sum, p) => sum + p.engagementRatePct, 0) / audiencePlatforms.length;
export const blendedEngagementDeltaPct = 0.6;
