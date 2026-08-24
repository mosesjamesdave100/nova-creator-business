// Notification feed. A real integration would push these from each connected
// platform/provider's webhooks (a new sponsorship inbound message, a payout
// confirmation, a content-performance threshold); for now this is a static
// authored feed, same convention as the Overview activity feed.
export const NOTIFICATION_CATEGORIES = {
  sponsorship: { label: "New Sponsorship", icon: "sponsors", tone: "accent" },
  content: { label: "Content", icon: "sparkle", tone: "violet" },
  audience: { label: "Audience", icon: "trendingUp", tone: "cyan" },
  payment: { label: "Payment", icon: "payout", tone: "muted" },
};

export const notifications = [
  {
    id: "n-1",
    category: "sponsorship",
    detail: "Pulse Audio sent you a $6,000 offer.",
    time: "18 min ago",
    read: false,
  },
  {
    id: "n-2",
    category: "content",
    detail: "Your latest Short is outperforming your average by 184%.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "n-3",
    category: "audience",
    detail: "Your viewers are 22% more active this week.",
    time: "3 hr ago",
    read: false,
  },
  {
    id: "n-4",
    category: "payment",
    detail: "$900 sponsorship payment received.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "n-5",
    category: "payment",
    detail: "$1,240.00 payout sent to your linked account.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "n-6",
    category: "audience",
    detail: "3 new members joined INSIDER Tier.",
    time: "2 days ago",
    read: true,
  },
];
