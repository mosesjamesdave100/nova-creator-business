import { Link } from "react-router-dom";
import { SectionHeading } from "./SectionHeading";
import { StatusBadge } from "../../dashboard/StatusBadge";
import { sponsorships } from "../../data/sponsorships";
import { currencyWhole } from "../../data/format";

const TEASER_IDS = ["sp-1", "sp-3", "sp-7"];
const STAGE_TONE = { Lead: "muted", Negotiating: "muted", Active: "accent", Delivered: "muted", Paid: "good" };

function formatDeadline(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SponsorshipSection() {
  const deals = TEASER_IDS.map((id) => sponsorships.find((s) => s.id === id));

  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="04 / BRAND DEALS"
          heading="MORE THAN ANALYTICS."
          copy="Manage the deals behind your audience."
        />
        <Link
          to="/sponsorships"
          className="shrink-0 rounded border border-[#333] px-6 py-[15px] text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent"
        >
          VIEW SPONSORSHIPS →
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3">
        {deals.map((deal) => (
          <div key={deal.id} className="rounded-xl border border-hairline bg-surface p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="font-display text-lg font-semibold">{deal.brand}</div>
              <StatusBadge label={deal.stage} tone={STAGE_TONE[deal.stage]} />
            </div>
            <div className="mt-3 font-display text-2xl font-semibold text-accent">
              {currencyWhole.format(deal.value)}
            </div>
            <div className="mt-3 text-sm text-muted">{deal.deliverables}</div>
            <div className="mt-4 border-t border-hairline pt-3 text-xs text-faint">
              Due {formatDeadline(deal.deadline)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
