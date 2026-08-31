// Growth recommendations computed FROM the mock data, not authored as static
// strings. This is intentionally simple rule-based arithmetic (averages,
// ratios, group-bys, peak-window search) - a real system would run
// equivalent logic on a schedule against each connected platform's actual
// analytics, likely with more signals, but the shape stays the same.
//
// Every insight has two parts, matching NOVA's core product principle
// (what happened / why it matters, then what to do next):
//   body           - the observation, backed by the numbers
//   recommendation - a concrete next action, derived from the same numbers
import { content } from "./content";
import { audienceActivityByHour } from "./audience";
import { sources as revenueSources, ranges as revenueRanges } from "./revenue";
import { average } from "./random";
import { currency } from "./format";

function timeOfDayBucket(hour) {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "late night";
}

function formatHour12(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h} ${period}`;
}

function computeShortsVsLongform() {
  const shorts = content.filter((c) => c.format === "short");
  const longform = content.filter((c) => c.format === "long-form");
  const avgShorts = average(shorts.map((c) => c.views));
  const avgLongform = average(longform.map((c) => c.views));
  const ratio = avgShorts / avgLongform;
  const suggestedCount = ratio >= 2 ? 2 : 1;

  return {
    id: "shorts-vs-longform",
    category: "Content",
    title: "Shorts are outperforming long-form",
    body: `Your Shorts are generating ${ratio.toFixed(1)}× more reach than your long-form videos over your last ${shorts.length} Shorts and ${longform.length} videos.`,
    recommendation: `Consider publishing ${suggestedCount} additional Short${suggestedCount > 1 ? "s" : ""} this week to capture more of that reach.`,
    metricLabel: "Avg. Shorts reach",
    metricValue: `${ratio.toFixed(1)}×`,
    sampleSize: `${shorts.length} Shorts · ${longform.length} long-form videos`,
    trend: "up",
    whyItMatters: "Short-form content is currently your strongest discovery channel, it's how most new viewers find you.",
    action: {
      label: "Create content plan",
      to: "/content-planner",
      state: { openForm: true, prefill: { title: "New Short (recommended by NOVA)", type: "youtube-short", status: "Idea" } },
    },
  };
}

function computeBestPublishingWindow() {
  const longform = content.filter((c) => c.format === "long-form");
  const buckets = new Map();

  for (const item of longform) {
    const key = `${item.dayOfWeek} ${timeOfDayBucket(item.hour)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(item.views);
  }

  let best = null;
  for (const [key, views] of buckets) {
    if (views.length < 2) continue; // not enough samples to trust
    const avg = average(views);
    if (!best || avg > best.avg) best = { key, avg, count: views.length };
  }

  const overallAvg = average(longform.map((c) => c.views));
  const upliftPct = best ? ((best.avg - overallAvg) / overallAvg) * 100 : 0;
  const windowTitleCase = best ? best.key.replace(/^\w/, (c) => c.toUpperCase()) : "—";

  return {
    id: "best-publishing-window",
    category: "Content",
    title: "You have a strongest publishing window",
    body: best
      ? `Your strongest publishing window appears to be ${best.key}, videos published then average ${Math.round(upliftPct)}% more views than your overall average.`
      : "Not enough published videos yet to identify a reliable publishing window.",
    recommendation: best
      ? `Prioritize your next long-form upload for ${windowTitleCase.toLowerCase()} to match your best-performing slot.`
      : "Publish a few more long-form videos to unlock this recommendation.",
    metricLabel: "Best window",
    metricValue: windowTitleCase,
    sampleSize: best ? `${best.count} videos in this window` : null,
    trend: "up",
    whyItMatters: best
      ? "Publishing outside this window means even strong content may launch before your audience is around to watch it."
      : "A reliable publishing window helps every future upload launch to an audience that's already there.",
    action: {
      label: "Plan next upload",
      to: "/content-planner",
      state: { openForm: true, prefill: { title: "Long-form upload for your best window", type: "youtube-video", status: "Idea" } },
    },
  };
}

function computeRetentionTrend() {
  const longform = content.filter((c) => c.format === "long-form"); // already sorted newest-first
  const recent = longform.slice(0, 3);
  const previous = longform.slice(3, 13);
  const avgRecent = average(recent.map((c) => c.retentionPct));
  const avgPrevious = average(previous.map((c) => c.retentionPct));
  const upliftPct = ((avgRecent - avgPrevious) / avgPrevious) * 100;

  return {
    id: "retention-trend",
    category: "Content",
    title: "Retention is trending up",
    body: `Your latest ${recent.length} videos are holding viewers ${Math.round(upliftPct)}% longer on average (${avgRecent.toFixed(0)}% retention) than your previous ${previous.length} (${avgPrevious.toFixed(0)}%).`,
    recommendation: `Keep the intro, pacing and editing choices from your last ${recent.length} videos, they're driving the retention gain.`,
    metricLabel: "Recent retention",
    metricValue: `${avgRecent.toFixed(0)}%`,
    sampleSize: `${recent.length} recent vs. ${previous.length} prior videos`,
    trend: upliftPct >= 0 ? "up" : "down",
    whyItMatters: "Better retention signals to platform algorithms that your content is worth recommending, compounding your reach on every future upload.",
    action: { label: "View content analytics", to: "/analytics" },
  };
}

// Slides a 3-hour window across the 24-hour activity curve and keeps the
// one with the highest total - the "when is my audience online" insight.
function computeAudienceActiveWindow() {
  const windowSize = 3;
  let best = null;
  for (let start = 0; start < 24; start++) {
    let total = 0;
    for (let i = 0; i < windowSize; i++) {
      total += audienceActivityByHour[(start + i) % 24];
    }
    if (!best || total > best.total) best = { start, total };
  }

  const windowLabel = `${formatHour12(best.start)}-${formatHour12((best.start + windowSize) % 24)}`;
  const recommendedHour = formatHour12((best.start + 1) % 24);
  const overallAvg = average(audienceActivityByHour) * windowSize;
  const upliftPct = ((best.total - overallAvg) / overallAvg) * 100;

  return {
    id: "audience-active-window",
    category: "Audience",
    title: "Your audience has a peak active window",
    body: `Your audience is most active between ${windowLabel}, activity in that window runs ${Math.round(upliftPct)}% above your daily average.`,
    recommendation: `Schedule your next upload around ${recommendedHour} so it's live before your audience peaks.`,
    metricLabel: "Peak window",
    metricValue: windowLabel,
    sampleSize: null,
    trend: "up",
    whyItMatters: "Uploading before this window gives your content the best chance to catch your audience while they're already engaged.",
    action: {
      label: "Schedule post",
      to: "/content-planner",
      state: {
        openForm: true,
        prefill: { title: "Upload timed to your peak audience window", type: "youtube-video", time: recommendedHour, status: "Idea" },
      },
    },
  };
}

function computeSponsorshipGrowth() {
  const sponsorship = revenueSources.find((s) => s.id === "sponsorships");

  return {
    id: "sponsorship-growth",
    category: "Revenue",
    title: "Sponsorship revenue is climbing",
    body: `Sponsorship revenue increased ${sponsorship.deltaPct}% this month, now your largest single revenue source.`,
    recommendation: "Demand is outpacing supply here, this is a good time to revisit your rate card for new deals.",
    metricLabel: "Sponsorship growth",
    metricValue: `+${sponsorship.deltaPct}%`,
    sampleSize: null,
    trend: "up",
    whyItMatters: "Demand from brands is outpacing what you're currently charging, this is where your business is growing fastest right now.",
    action: { label: "View brand deals", to: "/sponsorships" },
  };
}

function computeOverallRevenueGrowth() {
  const range = revenueRanges["30d"];

  return {
    id: "overall-revenue-growth",
    category: "Revenue",
    title: "Total revenue is trending up",
    body: `Your total revenue reached ${currency.format(range.total)} over the last 30 days, up ${range.deltaPct}% from the previous period across every source combined.`,
    recommendation: "Revisit your full revenue mix regularly, not just sponsorships, merch and memberships are both growing faster than your average source.",
    metricLabel: "Revenue growth (30d)",
    metricValue: `+${range.deltaPct}%`,
    sampleSize: null,
    trend: "up",
    whyItMatters: "Growth spread across multiple sources means your business is compounding rather than depending on one channel.",
    action: { label: "View revenue", to: "/revenue" },
  };
}

export const insights = [
  computeShortsVsLongform(),
  computeAudienceActiveWindow(),
  computeSponsorshipGrowth(),
  computeBestPublishingWindow(),
  computeRetentionTrend(),
  computeOverallRevenueGrowth(),
];

export function insightByCategory(category) {
  return insights.find((i) => i.category === category);
}
