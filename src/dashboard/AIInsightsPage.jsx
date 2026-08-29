import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { Reveal } from "./Reveal";
import { insights } from "../data/aiInsights";

function InsightCard({ insight }) {
  const positive = insight.trend === "up";
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex max-w-xl gap-4">
          <IconChip icon="sparkle" tone="accent" size={38} />
          <div>
            <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">
              {insight.category.toUpperCase()} · WHAT'S HAPPENING
            </div>
            <h3 className="mt-1.5 font-display text-lg font-semibold">{insight.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{insight.body}</p>
            {insight.sampleSize && <p className="mt-2 text-xs text-faint">Based on {insight.sampleSize}</p>}

            <div className="mt-4 text-[10px] font-semibold tracking-[0.08em] text-faint">WHY IT MATTERS</div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{insight.whyItMatters}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[11px] tracking-[0.06em] text-muted">{insight.metricLabel}</div>
          <div
            className={`mt-1 flex items-center justify-end gap-1.5 font-display text-2xl font-semibold ${positive ? "text-good" : "text-danger"}`}
          >
            <Icon name={positive ? "trendingUp" : "arrowDown"} size={16} />
            {insight.metricValue}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4 rounded-lg border border-accent/25 bg-accent/[0.06] px-4 py-3.5">
        <div className="flex items-start gap-3">
          <Icon name="trendingUp" size={15} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <div className="text-[11px] font-semibold tracking-[0.08em] text-accent">RECOMMENDED ACTION</div>
            <p className="mt-1 text-sm leading-relaxed text-text">{insight.recommendation}</p>
          </div>
        </div>
        {insight.action && (
          <Link
            to={insight.action.to}
            className="shrink-0 rounded border border-accent/40 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-accent transition-colors hover:bg-accent hover:text-bg"
          >
            {insight.action.label} &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}

export function AIInsightsPage() {
  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        NOVA doesn't just report what happened. Every card pairs an observation with the data behind it and a
        concrete next action, not generic advice. These are computed with simple rule-based comparisons over the mock
        content data below (not a live model). A real system would run the same kind of logic against your connected
        platforms on a schedule.
      </p>

      <div className="flex flex-col gap-5">
        {insights.map((insight, i) => (
          <Reveal key={insight.id} index={i}>
            <InsightCard insight={insight} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
