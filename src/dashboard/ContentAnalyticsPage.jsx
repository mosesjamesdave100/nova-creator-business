import { useState } from "react";
import { LineChart } from "./LineChart";
import { CategoryBarList } from "./CategoryBarList";
import { TopContentList } from "./TopContentList";
import { Reveal } from "./Reveal";
import { PageLinkButton } from "./PageLinkButton";
import { combinedSeries, seriesDates } from "../data/audience";
import { performanceByFormat } from "../data/content";
import { formatCompactNumber } from "../data/format";

const METRICS = {
  views: { label: "Views", series: combinedSeries.views, format: (v) => formatCompactNumber(Math.round(v)) },
  engagement: { label: "Engagement", series: combinedSeries.engagement, format: (v) => `${v.toFixed(1)}%` },
};

const RANGES = { "30d": 30, "90d": 90 };

export function ContentAnalyticsPage() {
  const [metric, setMetric] = useState("views");
  const [range, setRange] = useState("30d");

  const windowSize = RANGES[range];
  const activeMetric = METRICS[metric];
  const values = activeMetric.series.slice(-windowSize);
  const dates = seriesDates.slice(-windowSize);

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted">
          How your content is performing across formats and platforms. Mock data for this prototype, wire up
          Content Analytics to each platform's content API to replace it.
        </p>
        <PageLinkButton to="/insights" label="View insights" />
      </div>

      <Reveal index={0} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-1 rounded-md border border-hairline bg-bg p-1">
            {Object.entries(METRICS).map(([key, m]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMetric(key)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                  metric === key ? "bg-surface-2 text-text" : "text-muted hover:text-text"
                }`}
              >
                {m.label}
              </button>
            ))}
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
        <h3 className="mt-5 font-display text-lg font-semibold">{activeMetric.label} Over Time</h3>
        <div className="mt-5">
          <LineChart
            series={[{ id: metric, color: "#c7ff3d", values }]}
            dates={dates}
            formatValue={activeMetric.format}
            showArea
          />
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal index={1} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Content Performance by Format</h3>
          <p className="mt-1 text-sm text-muted">Average views per piece of content.</p>
          <div className="mt-6">
            <CategoryBarList
              items={performanceByFormat.map((f) => ({ label: f.label, value: Math.round(f.avgViews) }))}
              formatValue={(v) => formatCompactNumber(v)}
            />
          </div>
        </Reveal>

        <Reveal index={2}>
          <TopContentList />
        </Reveal>
      </div>
    </div>
  );
}
