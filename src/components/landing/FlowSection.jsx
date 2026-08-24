import { SectionHeading } from "./SectionHeading";
import { kpis } from "../../data/mockData";
import { currencyWhole } from "../../data/format";

function scrollToHowItWorks(e) {
  e.preventDefault();
  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
}

const revenueKpi = kpis.find((k) => k.id === "revenue");

const STAGES = [
  { label: "CONTENT", items: ["YouTube", "Twitch", "TikTok"] },
  { label: "AUDIENCE", items: ["Views", "Followers", "Engagement"] },
  { label: "MONETIZATION", items: ["Ads", "Sponsors", "Merch", "Memberships"] },
];

function Connector() {
  return (
    <div className="relative mx-auto h-10 w-px bg-hairline">
      <span className="flow-dot absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent" />
    </div>
  );
}

function StageCard({ label, items }) {
  return (
    <div className="w-full max-w-sm rounded-xl border border-hairline bg-surface px-8 py-6 text-center">
      <div className="font-display text-xs font-semibold tracking-[0.14em] text-muted">{label}</div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[15px] text-text">
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-2">
            {item}
            {i !== items.length - 1 && <span className="text-faint">&middot;</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export function FlowSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28">
      <SectionHeading
        eyebrow="01 / THE SYSTEM"
        heading={
          <>
            ONE CREATOR.
            <br />
            ONE OPERATING SYSTEM.
          </>
        }
        align="center"
      >
        <a
          href="#how-it-works"
          onClick={scrollToHowItWorks}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-text"
        >
          SEE HOW NOVA WORKS &rarr;
        </a>
      </SectionHeading>

      <div className="mt-14 flex flex-col items-center md:mt-16">
        {STAGES.map((stage) => (
          <div key={stage.label} className="flex w-full flex-col items-center">
            <StageCard label={stage.label} items={stage.items} />
            <Connector />
          </div>
        ))}

        <div className="w-full max-w-sm rounded-xl border border-accent/40 bg-surface px-8 py-7 text-center">
          <div className="font-display text-xs font-semibold tracking-[0.14em] text-accent">REVENUE</div>
          <div className="mt-3 font-display text-3xl font-semibold text-accent">
            {currencyWhole.format(revenueKpi.rawValue)}
            <span className="text-base font-medium text-muted"> / month</span>
          </div>
        </div>
      </div>
    </section>
  );
}
