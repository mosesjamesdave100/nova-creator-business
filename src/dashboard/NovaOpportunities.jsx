import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { Reveal } from "./Reveal";
import { opportunities } from "../data/opportunities";

const CATEGORY_ICON = { Content: "sparkle", Audience: "trendingUp", Revenue: "revenue", Store: "bag" };

function OpportunityCard({ opportunity }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-hairline bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <IconChip icon={CATEGORY_ICON[opportunity.category]} tone="accent" size={34} />
        <div className="text-right">
          <div className="text-[10px] font-semibold tracking-[0.08em] text-muted">{opportunity.category.toUpperCase()}</div>
          <div className="mt-1 font-display text-xl font-semibold text-accent">{opportunity.metric}</div>
        </div>
      </div>

      <h4 className="mt-3 text-[15px] font-semibold leading-snug text-text">{opportunity.title}</h4>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">{opportunity.explanation}</p>

      <div className="mt-3 text-[10px] font-semibold tracking-[0.08em] text-faint">WHY IT MATTERS</div>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">{opportunity.whyItMatters}</p>

      <div className="mt-auto pt-4">
        <div className="rounded-lg border border-accent/25 bg-accent/[0.06] px-3.5 py-3">
          <div className="text-[10px] font-semibold tracking-[0.08em] text-accent">RECOMMENDED ACTION</div>
          <p className="mt-1 text-[13px] leading-relaxed text-text">{opportunity.recommendation}</p>
        </div>
        <Link
          to={opportunity.action.to}
          state={opportunity.action.state}
          className="mt-3 flex items-center justify-center gap-1.5 rounded border border-accent/40 py-2.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-accent transition-colors hover:bg-accent hover:text-bg"
        >
          {opportunity.action.label}
          <Icon name="arrowRight" size={12} />
        </Link>
      </div>
    </div>
  );
}

export function NovaOpportunities() {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold">NOVA Opportunities</h3>
      </div>
      <p className="mt-1 text-sm text-muted">Actions worth your attention right now.</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {opportunities.map((opportunity, i) => (
          <Reveal key={opportunity.id} index={i} className="h-full">
            <OpportunityCard opportunity={opportunity} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
