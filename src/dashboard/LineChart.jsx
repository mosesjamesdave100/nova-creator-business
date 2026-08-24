import { useRef, useState } from "react";

const WIDTH = 720;
const HEIGHT = 220;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 8;
const GRID_STEPS = 3;

// General-purpose time-series chart: pass one series for a filled area
// chart (Analytics "over time" cards, matches RevenueChart's treatment), or
// several for a platform-comparison multi-line chart with a legend and a
// one-tooltip-every-series readout on hover, per the dataviz skill's
// interaction rules.
export function LineChart({ series, dates, formatValue = (v) => `${v}`, formatTick, showArea = false }) {
  const tickFormatter = formatTick ?? formatValue;
  const [hoverIndex, setHoverIndex] = useState(null);
  const svgRef = useRef(null);

  const allValues = series.flatMap((s) => s.values);
  const min = Math.min(0, ...allValues);
  const max = Math.max(...allValues, 1);
  const range = max - min || 1;
  const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const count = dates.length;

  function xAt(i) {
    return PAD_LEFT + (count === 1 ? 0 : (i / (count - 1)) * innerW);
  }
  function yAt(v) {
    return PAD_TOP + innerH - ((v - min) / range) * innerH;
  }

  const seriesPaths = series.map((s) => {
    const coords = s.values.map((v, i) => [xAt(i), yAt(v)]);
    const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const areaPath = showArea
      ? `${linePath} L${coords[coords.length - 1][0].toFixed(1)},${HEIGHT - PAD_BOTTOM} L${coords[0][0].toFixed(1)},${HEIGHT - PAD_BOTTOM} Z`
      : null;
    return { ...s, coords, linePath, areaPath };
  });

  function handlePointerMove(event) {
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((event.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < count; i++) {
      const dist = Math.abs(xAt(i) - relX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    }
    setHoverIndex(nearest);
  }

  const gridLines = Array.from({ length: GRID_STEPS + 1 }, (_, i) => {
    const y = PAD_TOP + (i / GRID_STEPS) * innerH;
    const value = max - (i / GRID_STEPS) * (max - min);
    return { y, value };
  });

  const hoverX = hoverIndex !== null ? xAt(hoverIndex) : null;

  return (
    <div className="relative">
      {series.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-4">
          {series.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} />
              {s.label}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex shrink-0 flex-col justify-between py-3 text-[11px] text-faint">
          {gridLines.map((line) => (
            <span key={line.y} className="whitespace-nowrap">
              {tickFormatter(line.value)}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full touch-none"
            style={{ height: "auto" }}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIndex(null)}
          >
            {gridLines.map((line) => (
              <line key={line.y} x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={line.y} y2={line.y} stroke="#1f1f1f" strokeWidth="1" />
            ))}

            {seriesPaths.map(
              (s) =>
                s.areaPath && (
                  <path key={`${s.id}-area`} d={s.areaPath} fill={s.color} fillOpacity={0.14} stroke="none" />
                )
            )}
            {seriesPaths.map((s) => (
              <path
                key={`${s.id}-line`}
                d={s.linePath}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {hoverX !== null && (
              <>
                <line x1={hoverX} x2={hoverX} y1={PAD_TOP} y2={HEIGHT - PAD_BOTTOM} stroke="#3a3a3a" strokeWidth="1" />
                {seriesPaths.map((s) => (
                  <circle
                    key={`${s.id}-dot`}
                    cx={s.coords[hoverIndex][0]}
                    cy={s.coords[hoverIndex][1]}
                    r="4"
                    fill={s.color}
                    stroke="#111111"
                    strokeWidth="2"
                  />
                ))}
              </>
            )}
          </svg>

          {hoverIndex !== null && (
            <div
              className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border border-hairline bg-surface-2 px-3 py-2 text-xs shadow-[0_12px_28px_-10px_rgba(0,0,0,0.7)]"
              style={{ left: `${(hoverX / WIDTH) * 100}%` }}
            >
              <div className="mb-1 text-muted">{dates[hoverIndex]}</div>
              {series.map((s) => (
                <div key={s.id} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="h-0.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="font-semibold text-text">{formatValue(s.values[hoverIndex])}</span>
                  {series.length > 1 && <span className="text-muted">{s.label}</span>}
                </div>
              ))}
            </div>
          )}

          <div className="mt-1.5 flex justify-between text-[11px] text-faint">
            <span>{dates[0]}</span>
            <span>{dates[Math.round((dates.length - 1) / 2)]}</span>
            <span>{dates[dates.length - 1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
