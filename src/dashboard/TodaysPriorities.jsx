import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { sponsorships } from "../data/sponsorships";
import { insightByCategory } from "../data/aiInsights";
import { conversionRateDeltaPct } from "../data/shop";
import { currencyWhole } from "../data/format";

// The single highest-signal "what should I do right now" surface on the
// whole dashboard, replacing what used to be two separate cards
// (Recommended Actions + Upcoming Opportunities) - one merged list reads
// faster and keeps the page from feeling crowded. Every item is pulled
// straight from the same data other pages read, never a separately
// authored list, and every item links to where the creator would actually
// act on it.
const OPEN_SPONSOR_STAGES = new Set(["Lead", "Negotiating"]);

function buildPriorities() {
  const items = [];

  const waitingDeal = [...sponsorships]
    .filter((d) => OPEN_SPONSOR_STAGES.has(d.stage))
    .sort((a, b) => b.value - a.value)[0];
  if (waitingDeal) {
    items.push({
      id: "sponsorship",
      icon: "sponsors",
      label: `${currencyWhole.format(waitingDeal.value)} sponsorship waiting`,
      action: `Review ${waitingDeal.brand}'s offer`,
      to: "/sponsorships",
    });
  }

  const contentInsight = insightByCategory("Content");
  if (contentInsight) {
    items.push({
      id: "content",
      icon: "sparkle",
      label: "Content opportunity",
      action: contentInsight.title,
      to: contentInsight.action?.to ?? "/insights",
    });
  }

  const audienceInsight = insightByCategory("Audience");
  if (audienceInsight) {
    items.push({
      id: "audience",
      icon: "trendingUp",
      label: "Audience opportunity",
      action: audienceInsight.title,
      to: audienceInsight.action?.to ?? "/insights",
    });
  }

  items.push({
    id: "revenue",
    icon: "revenue",
    label: "Revenue opportunity",
    action: `Store conversion increased ${conversionRateDeltaPct}%`,
    to: "/shop",
  });

  return items;
}

const priorities = buildPriorities();

export function TodaysPriorities() {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <h3 className="font-display text-lg font-semibold">Today's Priorities</h3>
      <div className="mt-4 flex flex-col divide-y divide-hairline">
        {priorities.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className="group flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
          >
            <Icon name={item.icon} size={14} className="mt-0.5 shrink-0 text-accent" />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-text">{item.label}</div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted transition-colors group-hover:text-accent">
                {item.action}
                <Icon name="arrowRight" size={11} className="shrink-0" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
