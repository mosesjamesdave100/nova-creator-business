import { topContent, FORMAT_LABELS } from "../data/content";
import { formatCompactNumber } from "../data/format";

export function TopContentList() {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
      <h3 className="font-display text-lg font-semibold">Top Content</h3>
      <div className="mt-5 flex flex-col">
        {topContent.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 py-3.5 ${i !== topContent.length - 1 ? "border-b border-hairline" : ""}`}
          >
            <div className="w-5 shrink-0 text-center font-display text-sm text-faint">{i + 1}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-text">{item.title}</div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
                <span className="rounded bg-surface-2 px-1.5 py-0.5 tracking-[0.04em] text-faint">
                  {FORMAT_LABELS[item.format]}
                </span>
                <span className="capitalize">{item.platform}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-sm font-semibold text-text">{formatCompactNumber(item.views)}</div>
              <div className="text-[11px] text-muted">{item.engagementRatePct}% eng.</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
