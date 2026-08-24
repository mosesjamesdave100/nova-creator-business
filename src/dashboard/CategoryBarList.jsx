// Horizontal bar-per-category comparison. One hue throughout: these are
// nominal categories (format types) being compared by magnitude, not
// identity, so per the dataviz skill they take the same slot color rather
// than a rainbow - only the bar length carries the comparison.
export function CategoryBarList({ items, formatValue = (v) => `${v}`, color = "#c7ff3d" }) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="text-text">{item.label}</span>
            <span className="text-muted">{formatValue(item.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${(item.value / max) * 100}%`, background: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
