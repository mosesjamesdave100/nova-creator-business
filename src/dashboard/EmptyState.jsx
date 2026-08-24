import { Icon } from "./Icon";

// Shared empty/disconnected/error placeholder - any card or page that can
// legitimately have "nothing here yet" uses this instead of inventing its
// own one-off blank state.
const TONE_STYLES = {
  muted: "text-muted",
  warning: "border-warning/25 bg-warning/10 text-warning",
  danger: "border-danger/25 bg-danger/10 text-danger",
};

export function EmptyState({ icon = "inbox", title, description, actionLabel, onAction, tone = "muted", compact }) {
  const toneClass = TONE_STYLES[tone] ?? TONE_STYLES.muted;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed text-center ${
        tone === "muted" ? "border-hairline" : toneClass
      } ${compact ? "px-4 py-6" : "px-6 py-10"}`}
    >
      <Icon name={icon} size={compact ? 18 : 22} className={tone === "muted" ? "text-faint" : ""} />
      <div className={`mt-1.5 text-sm font-semibold ${tone === "muted" ? "text-text" : ""}`}>{title}</div>
      {description && <div className={`max-w-[260px] text-[13px] ${tone === "muted" ? "text-muted" : ""}`}>{description}</div>}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 text-[13px] font-semibold text-accent transition-colors hover:underline"
        >
          {actionLabel} &rarr;
        </button>
      )}
    </div>
  );
}
