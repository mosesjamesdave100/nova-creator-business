import { Icon } from "./Icon";

// A colored circular icon badge - used on KPI cards, activity rows and
// product thumbnails so each item reads at a glance instead of every row
// looking like flat identical text.
const TONES = {
  accent: "bg-accent/10 text-accent",
  violet: "bg-violet/15 text-violet",
  cyan: "bg-[#2fa0c9]/15 text-[#2fa0c9]",
  muted: "bg-surface-2 text-muted",
};

export function IconChip({ icon, tone = "accent", size = 34 }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full ${TONES[tone] ?? TONES.accent}`}
      style={{ width: size, height: size }}
    >
      <Icon name={icon} size={Math.round(size * 0.48)} />
    </div>
  );
}
