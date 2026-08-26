import { Link } from "react-router-dom";
import { revenueSources } from "../data/mockData";
import { currency } from "../data/format";

const SIZE = 168;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;

function buildSegments(items) {
  let cumulative = 0;
  return items.map((item) => {
    const segment = (item.pct / 100) * CIRCUMFERENCE;
    const dashArray = `${Math.max(segment - GAP, 0)} ${CIRCUMFERENCE - segment + GAP}`;
    const dashOffset = -cumulative;
    cumulative += segment;
    return { ...item, dashArray, dashOffset };
  });
}

export function RevenueSources() {
  const segments = buildSegments(revenueSources.items);

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Revenue Sources</h3>
        <Link to="/revenue" className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-text">
          View report
        </Link>
      </div>

      <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row sm:items-center">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
            <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#1f1f1f" strokeWidth={STROKE} />
            {segments.map((item) => (
              <circle
                key={item.id}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={item.color}
                strokeWidth={STROKE}
                strokeDasharray={item.dashArray}
                strokeDashoffset={item.dashOffset}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[10px] tracking-[0.06em] text-muted">TOTAL REVENUE</div>
            <div className="mt-1 font-display text-xl font-semibold">{currency.format(revenueSources.total)}</div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          {revenueSources.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2.5 text-muted">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
                <span className="text-text">{item.label}</span>
              </div>
              <div className="flex items-center gap-3 text-muted">
                <span>{item.pct}%</span>
                <span className="w-16 text-right text-text">
                  {currency.format((item.pct / 100) * revenueSources.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
