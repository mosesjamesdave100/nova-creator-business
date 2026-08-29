// Settings page defaults. General/Profile reuse the same creator identity
// Media Kit and the public profile already show (never a second copy of
// the same name/bio), the rest are settings-only demo values. All of this
// is local state today - a real account system would load/save it via API.
import { creatorProfile } from "./creatorProfile";
import { socialLinks } from "./socialLinks";

export const generalSettings = {
  displayName: creatorProfile.name,
  username: creatorProfile.username,
  email: "nova@novacreator.com",
  timezone: "America/Chicago (CST)",
  currency: "USD ($)",
};

export const profileSettings = {
  displayName: creatorProfile.name,
  bio: creatorProfile.bio,
  website: "https://novacreator.com",
  socialLinks,
};

export const notificationPreferences = {
  sponsorshipAlerts: true,
  contentPerformanceAlerts: true,
  audienceInsights: true,
  revenueAlerts: true,
  communityActivity: false,
  storeAlerts: true,
  emailNotifications: true,
  pushNotifications: false,
};

export const privacySettings = {
  profileVisibility: "Public",
  analyticsVisibility: "Private",
  dataSharing: "Minimal",
};

export const securityInfo = {
  passwordLastChanged: "3 months ago",
  twoFactorEnabled: false,
  activeSessions: [
    { id: "session-1", device: "MacBook Pro · Chrome", location: "Austin, TX", lastActive: "Active now", current: true },
    { id: "session-2", device: "iPhone 15 · Safari", location: "Austin, TX", lastActive: "2 hr ago", current: false },
  ],
};

export const billingInfo = {
  plan: "NOVA Creator Pro",
  priceLabel: "$29/month",
  usage: { label: "Connected platforms", used: 4, limit: 7 },
  billingCycle: "Renews Sep 24, 2026",
  paymentMethod: "Visa •••• 4242",
};

export const TEAM_ROLES = ["Manager", "Editor", "Viewer"];

export const teamMembers = [
  { id: "team-1", name: creatorProfile.name, email: generalSettings.email, role: "Owner", status: "Active" },
  { id: "team-2", name: "Maya Fontaine", email: "maya@novacreator.com", role: "Manager", status: "Active" },
  { id: "team-3", name: "Chris Okafor", email: "chris@novacreator.com", role: "Editor", status: "Invited" },
];

export const appearanceSettings = {
  theme: "Dark",
  compactMode: false,
  dashboardDensity: "Comfortable",
};
