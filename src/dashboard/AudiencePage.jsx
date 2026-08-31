import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { LineChart } from "./LineChart";
import { BarChart } from "./BarChart";
import { CategoryBarList } from "./CategoryBarList";
import { Reveal } from "./Reveal";
import { EmptyState } from "./EmptyState";
import { InsightCard } from "./AIInsightsPage";
import {
  audiencePlatforms,
  combinedSeries,
  seriesDates,
  totalFollowers,
  totalFollowersDeltaPct,
  audienceActivityByHour,
  newVsReturning,
  audienceInterests,
} from "../data/audience";
import { ageBreakdown, genderBreakdown, topLocations } from "../data/demographics";
import { formatCompactNumber } from "../data/format";
import { CONNECTIONS, CONNECTION_STATE } from "../data/connections";
import { insightByCategory } from "../data/aiInsights";

const RANGES = { "30d": 30, "90d": 90 };
const HOUR_TICK_LABELS = ["12 AM", "6 AM", "12 PM", "6 PM", "11 PM"];
const audienceInsight = insightByCategory("Audience");

function PlatformCard({ platform }) {
  const connection = CONNECTIONS[platform.id];
  const notConnected = connection?.state === CONNECTION_STATE.NOT_CONNECTED;

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ background: `${platform.brandColor}22` }}
        >
          <Icon name="play" size={14} style={{ color: platform.brandColor }} />
        </div>
        <div className="text-sm font-semibold text-text">{platform.name}</div>
      </div>

      {notConnected ? (
        <div className="mt-4">
          <EmptyState
            icon="alert"
            title="Account not connected"
            description={`Connect ${platform.name} to unlock its live analytics.`}
            compact
          />
          <Link
            to="/integrations"
            className="mt-3 block rounded border border-transparent bg-accent py-2 text-center text-[12px] font-semibold text-bg transition-transform hover:scale-[1.02]"
          >
            Connect {platform.name} &rarr;
          </Link>
        </div>
      ) : (
        <>
          {connection?.state === CONNECTION_STATE.NEEDS_ATTENTION && (
            <div className="mt-3 rounded-md border border-warning/25 bg-warning/10 px-3 py-2 text-[11px] text-warning">
              {connection.detail}
            </div>
          )}
          <div className="mt-4 font-display text-2xl font-semibold leading-none">
            {formatCompactNumber(platform.followers)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[13px] text-good">
            <Icon name="arrowUp" size={12} />+{platform.followersDeltaPct}%
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-4 text-xs">
            <div>
              <div className="text-muted">Views (30d)</div>
              <div className="mt-1 font-semibold text-text">{formatCompactNumber(platform.views30d)}</div>
            </div>
            <div>
              <div className="text-muted">Engagement</div>
              <div className="mt-1 font-semibold text-text">{platform.engagementRatePct}%</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function AudiencePage() {
  const [range, setRange] = useState("30d");
  const windowSize = RANGES[range];

  const followersValues = combinedSeries.followers.slice(-windowSize);
  const dates = seriesDates.slice(-windowSize);

  const platformSeries = audiencePlatforms.map((p) => ({
    id: p.id,
    label: p.name,
    color: p.chartColor,
    values: p.followersSeries.slice(-30),
  }));
  const platformDates = seriesDates.slice(-30);

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Who your audience is and when they're around. Mock data for this prototype, connect YouTube, Twitch, TikTok
        and Instagram under Integrations to replace it with live figures.
      </p>

      <Reveal index={0} className="mb-6">
        <InsightCard insight={audienceInsight} />
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {audiencePlatforms.map((platform, i) => (
          <Reveal key={platform.id} index={i + 1}>
            <PlatformCard platform={platform} />
          </Reveal>
        ))}
      </div>

      <Reveal index={5} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold">Followers Over Time</h3>
            <div className="mt-2 font-display text-2xl font-semibold">{formatCompactNumber(totalFollowers)}</div>
            <div className="mt-1 text-[13px] text-good">+{totalFollowersDeltaPct}% vs last 30 days</div>
          </div>
          <div className="flex gap-1 rounded-md border border-hairline bg-bg p-1">
            {Object.keys(RANGES).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                  range === key ? "bg-surface-2 text-text" : "text-muted hover:text-text"
                }`}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <LineChart
            series={[{ id: "followers", color: "#c7ff3d", values: followersValues }]}
            dates={dates}
            formatValue={(v) => formatCompactNumber(Math.round(v))}
            showArea
          />
        </div>
      </Reveal>

      <Reveal index={6} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <h3 className="font-display text-lg font-semibold">Platform Comparison</h3>
        <p className="mt-1 text-sm text-muted">Followers over the last 30 days.</p>
        <div className="mt-5">
          <LineChart
            series={platformSeries}
            dates={platformDates}
            formatValue={(v) => formatCompactNumber(Math.round(v))}
          />
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal index={7} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">New vs. Returning</h3>
          <p className="mt-1 text-sm text-muted">Share of viewers over the last 30 days.</p>
          <div className="mt-6 flex items-center gap-6">
            <div className="flex-1">
              <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-accent" style={{ width: `${newVsReturning.newPct}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-text">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  New <span className="font-semibold">{newVsReturning.newPct}%</span>
                </span>
                <span className="flex items-center gap-1.5 text-text">
                  <span className="h-2 w-2 rounded-full bg-surface-2" />
                  Returning <span className="font-semibold">{newVsReturning.returningPct}%</span>
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal index={8} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Audience Interests</h3>
          <p className="mt-1 text-sm text-muted">What else your viewers engage with.</p>
          <div className="mt-6">
            <CategoryBarList items={audienceInterests} formatValue={(v) => `${v}%`} />
          </div>
        </Reveal>
      </div>

      <Reveal index={9} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <h3 className="font-display text-lg font-semibold">Demographics</h3>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <div className="mb-3 text-[11px] font-semibold tracking-[0.08em] text-muted">AGE</div>
            <CategoryBarList items={ageBreakdown} formatValue={(v) => `${v}%`} />
          </div>
          <div>
            <div className="mb-3 text-[11px] font-semibold tracking-[0.08em] text-muted">GENDER</div>
            <CategoryBarList items={genderBreakdown} formatValue={(v) => `${v}%`} />
          </div>
          <div>
            <div className="mb-3 text-[11px] font-semibold tracking-[0.08em] text-muted">TOP LOCATIONS</div>
            <CategoryBarList items={topLocations} formatValue={(v) => `${v}%`} />
          </div>
        </div>
      </Reveal>

      <Reveal index={10} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <h3 className="font-display text-lg font-semibold">Active Hours</h3>
        <p className="mt-1 text-sm text-muted">When your audience is online, by hour (aggregated across platforms).</p>
        <div className="mt-6">
          <BarChart values={audienceActivityByHour} width={720} height={72} />
          <div className="mt-2 flex justify-between text-[11px] text-faint">
            {HOUR_TICK_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
