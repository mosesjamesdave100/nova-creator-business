import { Icon } from "../dashboard/Icon";
import { IconChip } from "../dashboard/IconChip";

// Shared selectable card for both single-select (creator type) and
// multi-select (platforms, goals) steps - the interaction differs at the
// call site, the card itself only needs to know if it's selected.
export function OptionCard({ option, selected, onClick, brandColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-colors ${
        selected ? "border-accent bg-accent/5" : "border-hairline bg-surface hover:border-[#333]"
      }`}
    >
      {brandColor ? (
        <div
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-semibold"
          style={{ background: `${brandColor}22`, color: brandColor }}
        >
          {option.label.charAt(0)}
        </div>
      ) : (
        <IconChip icon={option.icon} tone={selected ? "accent" : "muted"} />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-text">{option.label}</div>
        {option.detail && <div className="mt-0.5 text-[13px] text-muted">{option.detail}</div>}
      </div>
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected ? "border-accent bg-accent text-bg" : "border-[#333] text-transparent"
        }`}
      >
        <Icon name="check" size={12} />
      </span>
    </button>
  );
}
