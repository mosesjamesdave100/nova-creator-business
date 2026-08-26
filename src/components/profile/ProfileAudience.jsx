import { SectionHeading } from "../landing/SectionHeading";
import { CategoryBarList } from "../../dashboard/CategoryBarList";
import { totalFollowers, totalViews30d, blendedEngagementRatePct } from "../../data/audience";
import { ageBreakdown, topLocations } from "../../data/demographics";
import { formatCompactNumber } from "../../data/format";

const STATS = [
  { label: "TOTAL REACH", value: () => formatCompactNumber(totalFollowers) },
  { label: "VIEWS (30D)", value: () => formatCompactNumber(totalViews30d) },
  { label: "ENGAGEMENT RATE", value: () => `${blendedEngagementRatePct.toFixed(1)}%` },
];

export function ProfileAudience() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-20 lg:px-16">
      <SectionHeading eyebrow="03 — AUDIENCE" heading="Who's watching" />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-hairline bg-surface p-6">
            <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">{stat.label}</div>
            <div className="mt-2 font-display text-3xl font-semibold">{stat.value()}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-surface p-6 md:p-7">
          <h3 className="font-display text-base font-semibold">Age</h3>
          <div className="mt-5">
            <CategoryBarList items={ageBreakdown} formatValue={(v) => `${v}%`} />
          </div>
        </div>
        <div className="rounded-xl border border-hairline bg-surface p-6 md:p-7">
          <h3 className="font-display text-base font-semibold">Top Locations</h3>
          <div className="mt-5">
            <CategoryBarList items={topLocations} formatValue={(v) => `${v}%`} />
          </div>
        </div>
      </div>
    </section>
  );
}
