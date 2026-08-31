// Content planner data. A real integration would eventually let a creator
// schedule directly to YouTube Studio / Twitch / TikTok from here; today
// this is a plain editable plan, the same "manually-logged, not
// API-supplied" pattern used for sponsorships.
import { nextStream } from "./schedule";

export const CONTENT_TYPES = {
  "youtube-video": { label: "YouTube Video", icon: "youtube" },
  "youtube-short": { label: "YouTube Short", icon: "play" },
  "twitch-stream": { label: "Twitch Stream", icon: "play" },
  tiktok: { label: "TikTok", icon: "sparkle" },
  "community-post": { label: "Community Post", icon: "community" },
};

// Content workflow stage, shown as a status badge on every planner item.
export const CONTENT_STATUSES = ["Idea", "Planned", "In production", "Ready", "Published"];

const [, streamTime] = nextStream.date.split("·").map((s) => s.trim());

// Dates anchored to "today" so the week view always reads as genuinely
// upcoming relative to this prototype's fixed present (Mon Aug 24, 2026).
export const scheduledContent = [
  {
    id: "c-0",
    type: "community-post",
    title: "Behind the scenes: moving to the new studio",
    date: "2026-08-20",
    time: "11:00 AM",
    status: "Published",
  },
  {
    id: "c-1",
    type: "youtube-video",
    title: "5 Mistakes Every New Streamer Makes",
    date: "2026-08-24",
    time: "10:00 AM",
    status: "In production",
  },
  {
    id: "c-2",
    type: "tiktok",
    title: "Reacting to my worst clips ever",
    date: "2026-08-25",
    time: "7:00 PM",
    status: "Ready",
  },
  {
    id: "c-3",
    type: "youtube-short",
    title: "That reaction was insane (Part 2)",
    date: "2026-08-26",
    time: "12:00 PM",
    status: "Planned",
  },
  { id: "c-4", type: "twitch-stream", title: nextStream.title, date: "2026-08-28", time: streamTime, status: "Planned" },
  {
    id: "c-5",
    type: "community-post",
    title: "Tournament registrations are open",
    date: "2026-08-29",
    time: "9:00 AM",
    status: "Planned",
  },
];

export const draftContent = [
  { id: "d-1", type: "youtube-video", title: "Building My Setup From Scratch, Part 2", note: "Needs a thumbnail", status: "Idea" },
  { id: "d-2", type: "youtube-short", title: "Untitled clip from Saturday's stream", note: "Pick the best moment", status: "Idea" },
];
