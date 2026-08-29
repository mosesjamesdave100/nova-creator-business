import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { priorities } from "../data/priorities";

// The single highest-signal "what should I do right now" surface on the
// whole dashboard. Every item is pulled straight from the same data other
// pages/the notification feed already show, never a separately authored
// list, and every item links to where the creator would actually act on it.
export function TodaysPriorities() {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <h3 className="font-display text-lg font-semibold">Today's Priorities</h3>
      <p className="mt-1 text-xs text-muted">Your most important actions right now.</p>
      <div className="mt-4 flex flex-col divide-y divide-hairline">
        {priorities.map((item, i) => (
          <Link key={item.id} to={item.cta.to} className="group flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
            <span className="mt-0.5 shrink-0 font-display text-[11px] font-semibold text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold tracking-[0.08em] text-accent">{item.category.toUpperCase()}</div>
              <div className="mt-0.5 text-[13px] text-text">{item.detail}</div>
              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-muted transition-colors group-hover:text-accent">
                {item.cta.label.toUpperCase()}
                <Icon name="arrowRight" size={11} className="shrink-0" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
