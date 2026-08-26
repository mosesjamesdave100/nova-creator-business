// Content library across formats and platforms. Hand-authored (not
// generated) because the AI Growth Insights page computes its recommendations
// FROM this array at runtime - the numbers below are chosen so those
// computations land on a specific, true story (recent retention trending up,
// Thursday evening outperforming, Shorts outperforming long-form), not so a
// dashboard number "looks nice". A real integration replaces this array with
// the creator's actual video/stream/post history pulled from each platform's
// content API.
//
// format: "long-form" | "short" | "clip" | "post"
// dayOfWeek/hour are derived from publishedAt, not authored separately, so
// they can't drift out of sync.

const RAW_CONTENT = [
  // Long-form YouTube videos, oldest first. The most recent 3 (EP.047-049)
  // were cut differently (a faster-paced edit) and retain viewers noticeably
  // better than the 10 before them.
  { id: "lf-1", title: "NOVA // EP. 034 — Ranked Grind, Episode One", format: "long-form", platform: "youtube", publishedAt: "2026-05-28T19:00:00", views: 640000, engagementRatePct: 4.1, retentionPct: 41 },
  { id: "lf-2", title: "NOVA // EP. 035 — The Worst Team I've Ever Had", format: "long-form", platform: "youtube", publishedAt: "2026-06-02T18:00:00", views: 598000, engagementRatePct: 3.9, retentionPct: 39 },
  { id: "lf-3", title: "NOVA // EP. 036 — Q&A With The Community", format: "long-form", platform: "youtube", publishedAt: "2026-06-09T18:30:00", views: 512000, engagementRatePct: 4.4, retentionPct: 44 },
  { id: "lf-4", title: "NOVA // EP. 037 — Losing On Purpose (Challenge)", format: "long-form", platform: "youtube", publishedAt: "2026-06-16T19:00:00", views: 701000, engagementRatePct: 4.6, retentionPct: 46 },
  { id: "lf-5", title: "NOVA // EP. 038 — Building My Setup From Scratch", format: "long-form", platform: "youtube", publishedAt: "2026-06-23T17:00:00", views: 455000, engagementRatePct: 3.7, retentionPct: 40 },
  { id: "lf-6", title: "NOVA // EP. 039 — Duo Queue With A Pro", format: "long-form", platform: "youtube", publishedAt: "2026-06-30T18:00:00", views: 812000, engagementRatePct: 5.1, retentionPct: 48 },
  { id: "lf-7", title: "NOVA // EP. 040 — Reacting To My First Upload", format: "long-form", platform: "youtube", publishedAt: "2026-07-07T18:00:00", views: 388000, engagementRatePct: 3.5, retentionPct: 37 },
  { id: "lf-8", title: "NOVA // EP. 041 — The Tournament Recap", format: "long-form", platform: "youtube", publishedAt: "2026-07-14T19:00:00", views: 674000, engagementRatePct: 4.3, retentionPct: 45 },
  { id: "lf-9", title: "NOVA // EP. 042 — Ranked Grind, Episode Two", format: "long-form", platform: "youtube", publishedAt: "2026-07-21T18:00:00", views: 559000, engagementRatePct: 4.0, retentionPct: 42 },
  { id: "lf-10", title: "NOVA // EP. 043 — Answering Your Business Questions", format: "long-form", platform: "youtube", publishedAt: "2026-07-28T17:30:00", views: 421000, engagementRatePct: 3.6, retentionPct: 38 },
  { id: "lf-11", title: "NOVA // EP. 044 — New Gear, First Impressions", format: "long-form", platform: "youtube", publishedAt: "2026-08-01T18:00:00", views: 632000, engagementRatePct: 4.5, retentionPct: 47 },
  { id: "lf-12", title: "NOVA // EP. 045 — Community Tournament Finals", format: "long-form", platform: "youtube", publishedAt: "2026-08-06T19:00:00", views: 745000, engagementRatePct: 4.8, retentionPct: 49 },
  { id: "lf-13", title: "NOVA // EP. 046 — A Day In The Life", format: "long-form", platform: "youtube", publishedAt: "2026-08-11T18:30:00", views: 590000, engagementRatePct: 4.2, retentionPct: 43 },
  { id: "lf-14", title: "NOVA // EP. 047 — I Tried Winning With The Worst Loadout", format: "long-form", platform: "youtube", publishedAt: "2026-08-18T18:00:00", views: 1204000, engagementRatePct: 6.2, retentionPct: 61 },
  { id: "lf-15", title: "NOVA // EP. 048 — Coaching A Viewer Live", format: "long-form", platform: "youtube", publishedAt: "2026-08-19T19:00:00", views: 892000, engagementRatePct: 5.9, retentionPct: 58 },
  { id: "lf-16", title: "NOVA // EP. 049 — Ranked Grind, Season Finale", format: "long-form", platform: "youtube", publishedAt: "2026-08-20T18:30:00", views: 967000, engagementRatePct: 6.0, retentionPct: 63 },

  // Shorts / vertical clips, cross-posted to YouTube Shorts and TikTok.
  { id: "sh-1", title: "That reaction was insane", format: "short", platform: "tiktok", publishedAt: "2026-08-19T12:00:00", views: 2140000, engagementRatePct: 9.8 },
  { id: "sh-2", title: "Wait for the ending", format: "short", platform: "tiktok", publishedAt: "2026-08-17T13:00:00", views: 1870000, engagementRatePct: 8.9 },
  { id: "sh-3", title: "POV: your teammate is actually cracked", format: "short", platform: "youtube", publishedAt: "2026-08-15T12:30:00", views: 1420000, engagementRatePct: 7.6 },
  { id: "sh-4", title: "I did not expect this outcome", format: "short", platform: "tiktok", publishedAt: "2026-08-13T14:00:00", views: 1980000, engagementRatePct: 9.1 },
  { id: "sh-5", title: "This clip broke chat", format: "short", platform: "youtube", publishedAt: "2026-08-10T11:00:00", views: 1150000, engagementRatePct: 6.9 },
  { id: "sh-6", title: "Rate my setup 1-10", format: "short", platform: "instagram", publishedAt: "2026-08-08T15:00:00", views: 780000, engagementRatePct: 6.2 },
  { id: "sh-7", title: "The comeback nobody saw coming", format: "short", platform: "tiktok", publishedAt: "2026-08-05T13:30:00", views: 1660000, engagementRatePct: 8.4 },
  { id: "sh-8", title: "3 things I'd tell new streamers", format: "short", platform: "youtube", publishedAt: "2026-08-02T12:00:00", views: 940000, engagementRatePct: 6.5 },

  // Twitch clips.
  { id: "cl-1", title: "Chat did NOT believe this play", format: "clip", platform: "twitch", publishedAt: "2026-08-18T21:00:00", views: 62000, engagementRatePct: 11.2 },
  { id: "cl-2", title: "Viewer joins for a 1v1", format: "clip", platform: "twitch", publishedAt: "2026-08-14T20:30:00", views: 44000, engagementRatePct: 9.8 },
  { id: "cl-3", title: "Perfect ace to close the round", format: "clip", platform: "twitch", publishedAt: "2026-08-09T22:00:00", views: 51000, engagementRatePct: 10.4 },

  // Community posts.
  { id: "po-1", title: "Tournament registrations are open.", format: "post", platform: "instagram", publishedAt: "2026-08-20T10:00:00", views: 68000, engagementRatePct: 5.4 },
  { id: "po-2", title: "New merch drop teaser", format: "post", platform: "instagram", publishedAt: "2026-08-16T10:00:00", views: 91000, engagementRatePct: 6.8 },
  { id: "po-3", title: "Thank you for 128K across platforms", format: "post", platform: "instagram", publishedAt: "2026-08-12T09:30:00", views: 74000, engagementRatePct: 7.1 },
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const content = RAW_CONTENT.map((item) => {
  const date = new Date(item.publishedAt);
  return {
    ...item,
    publishedAt: date,
    dayOfWeek: DAY_NAMES[date.getDay()],
    hour: date.getHours(),
  };
}).sort((a, b) => b.publishedAt - a.publishedAt);

export const FORMAT_LABELS = {
  "long-form": "Long-form",
  short: "Shorts",
  clip: "Clips",
  post: "Posts",
};

export const topContent = [...content].sort((a, b) => b.views - a.views).slice(0, 6);

// One bar per format, same hue throughout (nominal categories being
// compared by magnitude, not identity - see the dataviz skill's rule on
// coloring nominal bars: never re-encode value via a rainbow, one hue reads
// the comparison correctly).
export const performanceByFormat = Object.keys(FORMAT_LABELS).map((format) => {
  const items = content.filter((c) => c.format === format);
  const avgViews = items.reduce((sum, c) => sum + c.views, 0) / items.length;
  const avgEngagementRatePct = items.reduce((sum, c) => sum + c.engagementRatePct, 0) / items.length;
  return { format, label: FORMAT_LABELS[format], count: items.length, avgViews, avgEngagementRatePct };
});
