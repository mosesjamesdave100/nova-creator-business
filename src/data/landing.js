// Marketing-page-only teaser data - a simplified narrative cut of revenue
// for the landing page's "Revenue Hub" section, distinct from both the
// Overview snapshot (store/memberships/digital/tips) and the full Revenue
// page's 6-source model (see revenue.js's header comment for why those two
// already differ). A landing page, a quick-glance widget and a full report
// legitimately group the same business differently; all three should read
// as internally consistent, not identical down to the cent.
export const revenueHubTeaser = {
  items: [
    { id: "ads", label: "AD REVENUE", value: 1840, color: "#cc5590" },
    { id: "sponsorships", label: "SPONSORSHIPS", value: 900, color: "#2fa0c9" },
    { id: "merch", label: "MERCH", value: 740, color: "#6f9e2a" },
    { id: "memberships", label: "MEMBERSHIPS", value: 800, color: "#9a9a9a" },
  ],
  get total() {
    return this.items.reduce((sum, item) => sum + item.value, 0);
  },
};
