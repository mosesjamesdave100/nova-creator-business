import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { BarChart } from "./BarChart";
import { audience } from "../data/mockData";
import { combinedSeries, seriesDates } from "../data/audience";

const GROWTH_WINDOW = 30;

// Daily net-new followers (delta of the cumulative series), the last 30
// days - a growth bar chart reads more clearly than plotting the raw
// cumulative total, which is just a monotonic ramp.
function buildDailyDeltas() {
  const series = combinedSeries.followers.slice(-GROWTH_WINDOW - 1);
  const deltas = [];
  for (let i = 1; i < series.length; i++) {
    deltas.push(Math.max(0, series[i] - series[i - 1]));
  }
  return deltas;
}

export function AudienceOverview() {
  const deltas = buildDailyDeltas();
  const startLabel = seriesDates[seriesDates.length - GROWTH_WINDOW];
  const endLabel = seriesDates[seriesDates.length - 1];

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Audience Overview</h3>
        <Link to="/audience" className="text-xs font-semibold text-muted hover:text-text">
          View all
        </Link>
      </div>

      <div className="mt-5 flex items-end gap-3">
        <div className="font-display text-3xl font-semibold leading-none">{audience.total}</div>
        <div className="flex items-center gap-1 pb-0.5 text-[13px] text-good">
          <Icon name="arrowUp" size={12} />+{audience.deltaPct}%
        </div>
      </div>
      <div className="mt-1 text-xs text-muted">Total followers across platforms</div>

      <div className="mt-5">
        <BarChart values={deltas} />
        <div className="mt-1.5 flex justify-between text-[11px] text-faint">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      </div>

      <div className="mt-5 flex divide-x divide-hairline border-t border-hairline pt-5">
        {audience.platforms.map((platform) => (
          <div key={platform.id} className="flex-1 px-2 text-center first:pl-0 last:pr-0">
            <div className="text-[10px] tracking-[0.06em] text-muted">{platform.shortLabel.toUpperCase()}</div>
            <div className="mt-1.5 font-display text-base font-semibold">{platform.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
