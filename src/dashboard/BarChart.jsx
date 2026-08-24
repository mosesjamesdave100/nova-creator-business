// Minimal bar chart primitive: thin bars, a 1-2px surface gap between them
// (per the dataviz skill's mark spec), recessive - no axis, meant for a
// compact "at a glance" trend inside a card, not a full analytical chart.
export function BarChart({ values, width = 280, height = 56, color = "#c7ff3d", minBarWidth = 3 }) {
  const max = Math.max(...values, 1);
  const gap = 2;
  const barWidth = Math.max(minBarWidth, width / values.length - gap);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {values.map((v, i) => {
        const barHeight = Math.max(2, (v / max) * height);
        const x = i * (barWidth + gap);
        return (
          <rect
            key={i}
            x={x}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={1}
            fill={color}
            opacity={0.35 + 0.65 * (v / max)}
          />
        );
      })}
    </svg>
  );
}
