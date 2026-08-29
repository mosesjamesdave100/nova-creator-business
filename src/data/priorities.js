// Today's Priorities: the dashboard's most compact "what needs my attention
// right now" list. Reuses the exact same notifications a creator already
// saw in the bell menu (never a re-authored copy of the same fact) plus one
// computed revenue figure, so this list can never drift from what those
// other surfaces say.
import { notifications } from "./notifications";
import { sources as revenueSources } from "./revenue";

const byId = (id) => notifications.find((n) => n.id === id);

const sponsorshipOffer = byId("n-1");
const contentPerformance = byId("n-2");
const audienceActivity = byId("n-3");
const sponsorshipRevenue = revenueSources.find((s) => s.id === "sponsorships");

export const priorities = [
  { id: "sponsorship", category: "Sponsorship", detail: sponsorshipOffer.detail, cta: sponsorshipOffer.cta },
  { id: "content", category: "Content", detail: contentPerformance.detail, cta: contentPerformance.cta },
  { id: "audience", category: "Audience", detail: audienceActivity.detail, cta: audienceActivity.cta },
  {
    id: "revenue",
    category: "Revenue",
    detail: `Sponsorship revenue increased ${sponsorshipRevenue.deltaPct}%.`,
    cta: { label: "View revenue", to: "/revenue" },
  },
];
