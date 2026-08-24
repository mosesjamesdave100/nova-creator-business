import { MetricCard } from "./MetricCard";
import { RevenueChart } from "./RevenueChart";
import { RevenueSources } from "./RevenueSources";
import { ActivityFeed } from "./ActivityFeed";
import { ProductList } from "./ProductList";
import { AudienceOverview } from "./AudienceOverview";
import { RecommendedActions } from "./RecommendedActions";
import { UpcomingOpportunities } from "./UpcomingOpportunities";
import { QuickActions } from "./QuickActions";
import { CommunityCTA } from "./CommunityCTA";
import { LiveStatus } from "./LiveStatus";
import { Reveal } from "./Reveal";
import { kpis, kpiComparisonLabel } from "../data/mockData";

export function OverviewPage() {
  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
        {kpis.map((kpi, i) => (
          <Reveal key={kpi.id} index={i}>
            <MetricCard {...kpi} comparisonLabel={kpiComparisonLabel} />
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <Reveal index={5}>
            <RevenueChart />
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Reveal index={6}>
              <ActivityFeed />
            </Reveal>
            <Reveal index={7}>
              <ProductList />
            </Reveal>
          </div>

          <Reveal index={8}>
            <QuickActions />
          </Reveal>
          <Reveal index={9}>
            <CommunityCTA />
          </Reveal>
        </div>

        <div className="flex flex-col gap-6">
          <Reveal index={6}>
            <RecommendedActions />
          </Reveal>
          <Reveal index={7}>
            <UpcomingOpportunities />
          </Reveal>
          <Reveal index={8}>
            <RevenueSources />
          </Reveal>
          <Reveal index={9}>
            <AudienceOverview />
          </Reveal>
          <Reveal index={10}>
            <LiveStatus />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
