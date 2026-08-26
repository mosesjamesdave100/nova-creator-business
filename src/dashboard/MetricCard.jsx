import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { Sparkline } from "./Sparkline";
import { useCountUp } from "../hooks/useCountUp";

export function MetricCard({ label, icon, rawValue, format, deltaPct, comparisonLabel, sparkline }) {
  const positive = deltaPct >= 0;
  const value = useCountUp(rawValue, { format });

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-surface p-5 transition-colors hover:border-[#2a2a2a]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <IconChip icon={icon} size={28} />
            <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">{label}</div>
          </div>
          <div className="mt-3 font-display text-[28px] font-semibold leading-none tabular-nums">{value}</div>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] whitespace-nowrap">
            <Icon
              name={positive ? "arrowUp" : "arrowDown"}
              size={13}
              className={positive ? "text-good" : "text-danger"}
            />
            <span className={positive ? "text-good" : "text-danger"}>
              {positive ? "+" : ""}
              {deltaPct}%
            </span>
            <span className="text-faint">{comparisonLabel}</span>
          </div>
        </div>
        <Sparkline points={sparkline} positive={positive} />
      </div>
    </div>
  );
}
