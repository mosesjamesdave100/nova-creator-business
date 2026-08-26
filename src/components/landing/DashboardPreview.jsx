import { Icon } from "../../dashboard/Icon";
import { IconChip } from "../../dashboard/IconChip";
import { MiniAreaChart } from "./MiniAreaChart";
import { kpis, revenue, revenueSources } from "../../data/mockData";
import { audiencePlatforms, totalViews30d, blendedEngagementRatePct } from "../../data/audience";
import { topContent } from "../../data/content";
import { formatCompactNumber } from "../../data/format";

const revenueValue = kpis.find((k) => k.id === "revenue");

function buildDonutSegments(items, circumference) {
  let cumulative = 0;
  return items.map((item) => {
    const segment = (item.pct / 100) * circumference;
    const dashArray = `${Math.max(segment - 2, 0)} ${circumference - segment + 2}`;
    const dashOffset = -cumulative;
    cumulative += segment;
    return { ...item, dashArray, dashOffset };
  });
}

function MiniDonut() {
  const size = 88;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const segments = buildDonutSegments(revenueSources.items, circumference);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1f1f1f" strokeWidth={stroke} />
      {segments.map((item) => (
        <circle
          key={item.id}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={item.color}
          strokeWidth={stroke}
          strokeDasharray={item.dashArray}
          strokeDashoffset={item.dashOffset}
        />
      ))}
    </svg>
  );
}

// A real screenshot of the dashboard's own components and data (KPIs,
// revenue chart, revenue sources, platform stats, top content) inside a
// browser-chrome frame - not a decorative illustration standing in for the
// product.
export function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-[#0c0c0c] shadow-[0_60px_120px_-60px_rgba(0,0,0,0.85)]">
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#333]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#333]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#333]" />
        <div className="ml-3 rounded bg-surface px-3 py-1 text-[11px] text-faint">nova.app/dashboard</div>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
          <div className="rounded-lg border border-hairline bg-surface p-3.5 md:p-4">
            <div className="flex items-center gap-2">
              <IconChip icon="analytics" size={22} />
              <span className="text-[10px] font-semibold tracking-[0.06em] text-muted">TOTAL REACH</span>
            </div>
            <div className="mt-2.5 font-display text-lg font-semibold md:text-xl">
              {formatCompactNumber(totalViews30d)}
            </div>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-3.5 md:p-4">
            <div className="flex items-center gap-2">
              <IconChip icon="trendingUp" size={22} />
              <span className="text-[10px] font-semibold tracking-[0.06em] text-muted">ENGAGEMENT</span>
            </div>
            <div className="mt-2.5 font-display text-lg font-semibold md:text-xl">
              {blendedEngagementRatePct.toFixed(1)}%
            </div>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-3.5 md:p-4">
            <div className="flex items-center gap-2">
              <IconChip icon="revenue" size={22} />
              <span className="text-[10px] font-semibold tracking-[0.06em] text-muted">MONTHLY REVENUE</span>
            </div>
            <div className="mt-2.5 font-display text-lg font-semibold md:text-xl">{revenueValue.format(revenueValue.rawValue)}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:mt-5 md:grid-cols-[1.5fr_1fr]">
          <div className="rounded-lg border border-hairline bg-surface p-4">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-muted">GROWTH, LAST 30 DAYS</div>
            <div className="mt-2">
              <MiniAreaChart values={revenue.ranges["30d"].points.map((p) => p.value)} />
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-hairline bg-surface p-4">
            <MiniDonut />
            <div className="flex flex-col gap-1.5 text-[11px]">
              {revenueSources.items.map((item) => (
                <div key={item.id} className="flex items-center gap-1.5 text-muted">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:mt-5 md:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface p-4">
            <div className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-muted">PLATFORMS</div>
            <div className="flex divide-x divide-hairline">
              {audiencePlatforms.map((platform) => (
                <div key={platform.id} className="flex-1 px-2 text-center first:pl-0 last:pr-0">
                  <div
                    className="mx-auto mb-1.5 flex h-5 w-5 items-center justify-center rounded"
                    style={{ background: `${platform.brandColor}22` }}
                  >
                    <Icon name="play" size={10} style={{ color: platform.brandColor }} />
                  </div>
                  <div className="text-xs font-semibold">{formatCompactNumber(platform.followers)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-hairline bg-surface p-4">
            <div className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-muted">TOP CONTENT</div>
            <div className="flex flex-col gap-2.5">
              {topContent.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate text-text">{item.title}</span>
                  <span className="shrink-0 font-semibold text-muted">{formatCompactNumber(item.views)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
