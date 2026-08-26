const TONES = {
  accent: "bg-accent/10 text-accent",
  good: "bg-good/10 text-good",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  muted: "bg-surface-2 text-muted",
};

export function StatusBadge({ label, tone = "muted" }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-[11px] font-semibold ${TONES[tone] ?? TONES.muted}`}>
      {label}
    </span>
  );
}
