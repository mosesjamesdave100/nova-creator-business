// Sponsorship / brand-deal pipeline. A real integration here is less "one
// API" and more a CRM-style data source (deals are usually logged manually
// or synced from a creator-marketplace tool), so this stays a plain editable
// record for now rather than something wired to a specific provider.
//
// A deal moves through one pipeline stage at a time (a kanban, not two
// independent status fields) - Lead -> Negotiating -> Active -> Delivered
// -> Paid. Brand names are fictional (a real company shown against a
// specific dollar figure and pipeline stage would read as a false claim of
// an actual deal), reused from earlier in this app's history rather than
// invented fresh each time.
export const PIPELINE_STAGES = ["Lead", "Negotiating", "Active", "Delivered", "Paid"];

export const sponsorships = [
  {
    id: "sp-1",
    brand: "Ironclad Peripherals",
    campaign: "Keyboard Launch",
    value: 4500,
    stage: "Negotiating",
    deadline: "2026-09-10",
    deliverables: "1 dedicated video, 2 posts",
    notes: "Countered their initial offer, waiting to hear back.",
  },
  {
    id: "sp-2",
    brand: "Voltbar Energy",
    campaign: "Ranked Grind Series",
    value: 4200,
    stage: "Paid",
    deadline: "2026-08-18",
    deliverables: "4 stream mentions, 1 Short",
    notes: "Paid via Stripe on Aug 20.",
  },
  {
    id: "sp-3",
    brand: "Pulse Audio",
    campaign: "Headset Launch",
    value: 6000,
    stage: "Active",
    deadline: "2026-09-02",
    deliverables: "1 dedicated video, 1 unboxing post",
    notes: "Filming this week, dedicated video due before the deadline.",
  },
  {
    id: "sp-4",
    brand: "Meridian VPN",
    campaign: "Fall Creator Bundle",
    value: 3100,
    stage: "Negotiating",
    deadline: "2026-09-18",
    deliverables: "2 stream mentions, 1 pinned post",
    notes: "Waiting on their legal review of the contract.",
  },
  {
    id: "sp-5",
    brand: "GripLine Peripherals",
    campaign: "Mousepad Collab",
    value: 5400,
    stage: "Delivered",
    deadline: "2026-08-10",
    deliverables: "1 dedicated video, 3 Shorts",
    notes: "All deliverables posted, invoice sent.",
  },
  {
    id: "sp-6",
    brand: "Northline Apparel",
    campaign: "Community Hoodie Co-Drop",
    value: 2600,
    stage: "Delivered",
    deadline: "2026-08-05",
    deliverables: "1 Short, 2 posts",
    notes: "Payment is 12 days overdue, follow-up sent.",
  },
  {
    id: "sp-7",
    brand: "Runeforge Gaming Chairs",
    campaign: "Q3 Setup Refresh",
    value: 8500,
    stage: "Paid",
    deadline: "2026-08-15",
    deliverables: "1 dedicated video, 2 Shorts, 3 stream overlays",
    notes: "Paid in full, campaign closed.",
  },
  {
    id: "sp-8",
    brand: "Skyline Audio",
    campaign: null,
    value: 3800,
    stage: "Lead",
    deadline: null,
    deliverables: "Not yet scoped",
    notes: "Inbound DM, awaiting their creative brief.",
  },
];

export const totalDealValue = sponsorships.reduce((sum, s) => sum + s.value, 0);

export const totalPipelineValue = sponsorships
  .filter((s) => s.stage === "Lead" || s.stage === "Negotiating" || s.stage === "Active")
  .reduce((sum, s) => sum + s.value, 0);

export const totalPaidValue = sponsorships.filter((s) => s.stage === "Paid").reduce((sum, s) => sum + s.value, 0);

export const totalOutstandingValue = sponsorships
  .filter((s) => s.stage === "Delivered")
  .reduce((sum, s) => sum + s.value, 0);
