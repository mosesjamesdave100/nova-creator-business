import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { nextStream } from "../data/schedule";
import { sponsorships } from "../data/sponsorships";
import { currencyWhole } from "../data/format";

function formatDeadline(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const OPEN_STAGES = new Set(["Negotiating", "Active"]);

export function UpcomingOpportunities() {
  const upcomingDeals = [...sponsorships]
    .filter((d) => OPEN_STAGES.has(d.stage) && d.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 2);

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Upcoming Opportunities</h3>
        <Link to="/sponsorships" className="text-xs font-semibold text-muted hover:text-text">
          View all
        </Link>
      </div>
      <div className="mt-4 flex flex-col divide-y divide-hairline">
        <div className="flex items-start gap-3 py-3.5 first:pt-0">
          <Icon name="calendar" size={14} className="mt-0.5 shrink-0 text-muted" />
          <div className="min-w-0">
            <div className="text-[13px] text-text">{nextStream.title}</div>
            <div className="mt-0.5 text-xs text-muted">
              {nextStream.date} &middot; {nextStream.platform}
            </div>
          </div>
        </div>
        {upcomingDeals.map((deal) => (
          <div key={deal.id} className="flex items-start gap-3 py-3.5 last:pb-0">
            <Icon name="sponsors" size={14} className="mt-0.5 shrink-0 text-muted" />
            <div className="min-w-0">
              <div className="text-[13px] text-text">
                {deal.brand} deliverables due &middot; {currencyWhole.format(deal.value)}
              </div>
              <div className="mt-0.5 text-xs text-muted">Due {formatDeadline(deal.deadline)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
