// Shared 12-point de-emphasized trend line, its own final segment picked out
// in the accent/good/danger color so the reader's eye lands on "now". Used
// on KPI cards and product rows.
export function Sparkline({ points, positive = true, width = 96, height = 32 }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * height;
    return [x, y];
  });

  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const lastSegment = coords.slice(-4);
  const lastPath = lastSegment
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path d={path} fill="none" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={lastPath}
        fill="none"
        stroke={positive ? "var(--color-good)" : "var(--color-danger)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
