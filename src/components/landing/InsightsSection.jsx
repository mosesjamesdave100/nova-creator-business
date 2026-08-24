import { Link } from "react-router-dom";
import { SectionHeading } from "./SectionHeading";
import { Icon } from "../../dashboard/Icon";
import { IconChip } from "../../dashboard/IconChip";
import { insightByCategory } from "../../data/aiInsights";

const CATEGORIES = ["Content", "Audience", "Revenue"];

export function InsightsSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="06 / GROWTH INSIGHTS"
          heading={
            <>
              YOUR DATA.
              <br />
              BETTER DECISIONS.
            </>
          }
          copy="Recommendations computed from your own content, audience and revenue data, not generic advice."
        />
        <Link
          to="/insights"
          className="shrink-0 rounded border border-[#333] px-6 py-[15px] text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent"
        >
          SEE ALL INSIGHTS →
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3">
        {CATEGORIES.map((category) => {
          const insight = insightByCategory(category);
          return (
            <div key={category} className="rounded-xl border border-hairline bg-surface p-6">
              <div className="flex items-center gap-3">
                <IconChip icon="sparkle" tone="accent" size={30} />
                <div className="text-[11px] font-semibold tracking-[0.1em] text-muted">
                  {category.toUpperCase()}
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-text">{insight.body}</p>
              <Link
                to={insight.action ? insight.action.to : "/insights"}
                className="mt-4 flex items-start gap-2 border-t border-hairline pt-4 text-[13px] text-muted transition-colors hover:text-accent"
              >
                <Icon name="trendingUp" size={13} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  {insight.recommendation}
                  {insight.action && <span className="ml-1.5 font-semibold text-accent">{insight.action.label} &rarr;</span>}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
