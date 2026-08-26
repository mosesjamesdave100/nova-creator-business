import { useRef, useState } from "react";
import { revenue } from "../data/mockData";

const RANGE_TABS = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
  { id: "12m", label: "12M" },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const WIDTH = 720;
const HEIGHT = 220;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 8;

function buildPaths(points) {
  const values = points.map((p) => p.value);
  const min = Math.min(0, ...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const coords = points.map((p, i) => {
    const x = PAD_LEFT + (points.length === 1 ? 0 : (i / (points.length - 1)) * innerW);
    const y = PAD_TOP + innerH - ((p.value - min) / range) * innerH;
    return { x, y, ...p };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${HEIGHT - PAD_BOTTOM} L${coords[0].x.toFixed(1)},${HEIGHT - PAD_BOTTOM} Z`;

  return { coords, linePath, areaPath, min, max };
}

export function RevenueChart() {
  const [rangeId, setRangeId] = useState(revenue.defaultRange);
  const [hoverIndex, setHoverIndex] = useState(null);
  const svgRef = useRef(null);

  const range = revenue.ranges[rangeId];
  const { coords, linePath, areaPath, min, max } = buildPaths(range.points);
  const hovered = hoverIndex !== null ? coords[hoverIndex] : null;

  function handlePointerMove(event) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    coords.forEach((c, i) => {
      const dist = Math.abs(c.x - relX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  const gridSteps = 3;
  const gridLines = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const y = PAD_TOP + (i / gridSteps) * (HEIGHT - PAD_TOP - PAD_BOTTOM);
    const value = max - (i / gridSteps) * (max - min);
    return { y, value };
  });

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold">Revenue Overview</h3>
          <div className="mt-3 font-display text-[32px] font-semibold leading-none md:text-[36px]">
            {currency.format(hovered ? hovered.value : range.total)}
          </div>
          <div className="mt-2 text-[13px] text-muted">
            {hovered ? (
              <span className="text-text">{hovered.date}</span>
            ) : (
              <>
                <span className="text-good">+{range.deltaPct}%</span> vs previous period
              </>
            )}
          </div>
        </div>

        <div className="flex gap-1 rounded-md border border-hairline bg-bg p-1">
          {RANGE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setRangeId(tab.id);
                setHoverIndex(null);
              }}
              className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                rangeId === tab.id ? "bg-surface-2 text-text" : "text-muted hover:text-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-7">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full touch-none"
          style={{ height: "auto" }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        >
          {gridLines.map((line) => (
            <line
              key={line.y}
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={line.y}
              y2={line.y}
              stroke="#1f1f1f"
              strokeWidth="1"
            />
          ))}

          <defs>
            <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c7ff3d" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#c7ff3d" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#revenue-area)" stroke="none" />
          <path d={linePath} fill="none" stroke="#c7ff3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {hovered && (
            <>
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1={PAD_TOP}
                y2={HEIGHT - PAD_BOTTOM}
                stroke="#3a3a3a"
                strokeWidth="1"
              />
              <circle cx={hovered.x} cy={hovered.y} r="4" fill="#c7ff3d" stroke="#111111" strokeWidth="2" />
            </>
          )}
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border border-hairline bg-surface-2 px-3 py-2 text-xs shadow-[0_12px_28px_-10px_rgba(0,0,0,0.7)]"
            style={{ left: `${(hovered.x / WIDTH) * 100}%` }}
          >
            <div className="text-muted">{hovered.date}</div>
            <div className="mt-0.5 font-semibold text-text">{currency.format(hovered.value)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
