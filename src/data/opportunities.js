// NOVA Opportunities: the dashboard's headline "data -> insight -> opportunity
// -> recommendation -> action" surface. Reuses the SAME computed insights
// aiInsights.js already derives from content.js/audience.js/revenue.js (never
// a second copy of the numbers), just re-presented with the fuller
// category/metric/explanation/why-it-matters/recommendation/CTA shape this
// section needs. The Store opportunity is the one net-new figure, pulled
// from shop.js's actual top-selling product.
import { insightByCategory } from "./aiInsights";
import { bestSellers } from "./shop";

const contentInsight = insightByCategory("Content");
const audienceInsight = insightByCategory("Audience");
const revenueInsight = insightByCategory("Revenue");
const topProduct = bestSellers[0];

export const opportunities = [
  {
    id: "content",
    category: "Content",
    title: "Your Shorts are outperforming long-form.",
    metric: contentInsight.metricValue,
    explanation: `Your Shorts generated ${contentInsight.metricValue} more views than your long-form videos over the selected period.`,
    whyItMatters: contentInsight.whyItMatters,
    recommendation: "Publish 2 additional Shorts this week using topics from your highest-performing videos.",
    action: { label: "Create content plan", to: "/content-planner" },
  },
  {
    id: "audience",
    category: "Audience",
    title: "Your audience has a strong evening window.",
    metric: audienceInsight.metricValue.replace("-", " — "),
    explanation: "Viewer activity is consistently higher during this period.",
    whyItMatters: audienceInsight.whyItMatters,
    recommendation: "Schedule your next major upload around 8 PM.",
    action: { label: "Plan next upload", to: "/content-planner" },
  },
  {
    id: "revenue",
    category: "Revenue",
    title: "Sponsorship revenue is climbing.",
    metric: revenueInsight.metricValue,
    explanation: "Sponsorship revenue increased compared with the previous period.",
    whyItMatters: revenueInsight.whyItMatters,
    recommendation: "Follow up with active brand opportunities while demand is increasing.",
    action: { label: "View brand deals", to: "/sponsorships" },
  },
  {
    id: "store",
    category: "Store",
    title: "Your best product has room to grow.",
    metric: `+${topProduct.trendPct}%`,
    explanation: `${topProduct.name} has increased sales momentum over the previous period.`,
    whyItMatters:
      "Momentum on your best-selling product is the easiest revenue to compound, a small promotional push now converts buyers who are already primed to purchase.",
    recommendation: "Create a new promotional content campaign around this product.",
    action: { label: "View shop", to: "/shop" },
  },
];
