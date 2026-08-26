import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { insights } from "../data/aiInsights";

// The Overview's "what should I do next" surface - the highest-priority
// slot on the whole dashboard, per NOVA's core product principle. Pulls
// straight from the same computed insights the Insights page shows in
// full, never a separately-authored list.
export function RecommendedActions() {
  const top = insights.slice(0, 3);

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Recommended Actions</h3>
        <Link to="/insights" className="text-xs font-semibold text-muted hover:text-text">
          View all
        </Link>
      </div>
      <div className="mt-4 flex flex-col divide-y divide-hairline">
        {top.map((insight) => (
          <div key={insight.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
            <Icon name="trendingUp" size={14} className="mt-0.5 shrink-0 text-accent" />
            <p className="text-[13px] leading-relaxed text-text">{insight.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
