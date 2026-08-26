import { Link } from "react-router-dom";
import { SectionHeading } from "./SectionHeading";
import { MiniAreaChart } from "./MiniAreaChart";
import { revenueHubTeaser } from "../../data/landing";
import { revenue } from "../../data/mockData";
import { currencyWhole } from "../../data/format";

export function RevenueHubSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <SectionHeading
          eyebrow="03 / MONETIZATION"
          heading={
            <>
              YOUR REVENUE.
              <br />
              ONE VIEW.
            </>
          }
          copy="Every source your creator business earns from, in one dashboard."
        />

        <div className="w-full max-w-xs shrink-0 rounded-xl border border-hairline bg-surface p-5">
          <div className="text-[11px] font-semibold tracking-[0.06em] text-muted">30-DAY TREND</div>
          <div className="mt-2">
            <MiniAreaChart values={revenue.ranges["30d"].points.map((p) => p.value)} height={64} />
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:mt-16 md:grid-cols-4 md:gap-5">
        {revenueHubTeaser.items.map((item) => (
          <div key={item.id} className="rounded-xl border border-hairline bg-surface p-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.06em] text-muted">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />
              {item.label}
            </div>
            <div className="mt-2.5 font-display text-xl font-semibold md:text-2xl">
              {currencyWhole.format(item.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-xl border border-accent/40 bg-surface px-6 py-6 sm:flex-row sm:items-center md:px-8">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.06em] text-muted">TOTAL</div>
          <div className="mt-1.5 font-display text-3xl font-semibold text-accent">
            {currencyWhole.format(revenueHubTeaser.total)}
          </div>
        </div>
        <Link
          to="/revenue"
          className="rounded bg-accent px-6 py-[15px] text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          VIEW REVENUE →
        </Link>
      </div>
    </section>
  );
}
