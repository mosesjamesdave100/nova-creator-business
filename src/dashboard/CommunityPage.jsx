import { useState } from "react";
import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { StatusBadge } from "./StatusBadge";
import { LineChart } from "./LineChart";
import { Reveal } from "./Reveal";
import { PageLinkButton } from "./PageLinkButton";
import {
  communityOverview,
  communityActivity,
  communityEngagementSeries,
  communityMemberGrowthSeries,
  discordServer,
} from "../data/community";
import { topMembers } from "../data/communityMembers";
import { topDiscussions } from "../data/communityDiscussions";
import { communityPosts as INITIAL_POSTS } from "../data/communityPosts";
import { formatCompactNumber } from "../data/format";

const POST_STATUS_TONE = { Active: "good", Closed: "muted" };
const ACTIVITY_ICON = { Discussion: "content", Challenge: "trendingUp", Poll: "sparkle", Event: "calendar" };
const POST_TYPE_BY_MODE = { post: "Community post", poll: "Poll", announcement: "Announcement" };

const bestDiscussion = [...topDiscussions].sort((a, b) => b.likes - a.likes)[0];
const engagementTrendUp = communityEngagementSeries.values.at(-1) >= communityEngagementSeries.values[0];

function StatTile({ label, value }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}

function ComposeModal({ mode, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  const copy = {
    post: { heading: "Create Post", detailLabel: "What's on your mind?", submitLabel: "Post to community" },
    announcement: { heading: "Create Announcement", detailLabel: "Announcement details", submitLabel: "Post announcement" },
    poll: { heading: "Create Poll", detailLabel: "Poll options (comma separated)", submitLabel: "Publish poll" },
    event: { heading: "Create Event", detailLabel: "Date & time", submitLabel: "Schedule event" },
  }[mode];

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), detail: detail.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-hairline bg-surface-2 p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{copy.heading}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-faint hover:text-text">
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            autoFocus
            className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
          />
          <input
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={copy.detailLabel}
            className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button type="submit" className="rounded bg-accent px-5 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]">
            {copy.submitLabel}
          </button>
          <button type="button" onClick={onClose} className="text-[13px] font-semibold text-muted hover:text-text">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export function CommunityPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [modalMode, setModalMode] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  function handleComposeSubmit({ title, detail }) {
    if (modalMode === "event") {
      setConfirmation(`Event scheduled: "${title}"${detail ? ` · ${detail}` : ""}.`);
    } else {
      setPosts((prev) => [
        {
          id: `post-${Date.now()}`,
          title,
          type: POST_TYPE_BY_MODE[modalMode],
          engagement: "0 responses",
          comments: 0,
          status: "Active",
        },
        ...prev,
      ]);
      const noun = modalMode === "poll" ? "Poll" : modalMode === "announcement" ? "Announcement" : "Post";
      setConfirmation(`${noun} published: "${title}".`);
    }
    setModalMode(null);
    setTimeout(() => setConfirmation(null), 3500);
  }

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted">
          Understand, engage and grow your audience in one place. Mock data for this prototype, a real integration
          would sync this from Discord (or whichever community platform is connected) under Integrations.
        </p>
        <PageLinkButton to="/audience" label="View audience" />
      </div>

      <div className="mb-6 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setModalMode("post")}
          className="flex items-center gap-1.5 rounded bg-accent px-4 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          <Icon name="plus" size={13} />
          CREATE POST
        </button>
        <button
          type="button"
          onClick={() => setModalMode("announcement")}
          className="flex items-center gap-1.5 rounded border border-hairline bg-surface px-4 py-2.5 text-[13px] font-semibold text-text transition-colors hover:border-[#333]"
        >
          <Icon name="alert" size={13} className="text-muted" />
          CREATE ANNOUNCEMENT
        </button>
        <button
          type="button"
          onClick={() => setModalMode("poll")}
          className="flex items-center gap-1.5 rounded border border-hairline bg-surface px-4 py-2.5 text-[13px] font-semibold text-text transition-colors hover:border-[#333]"
        >
          <Icon name="sparkle" size={13} className="text-muted" />
          CREATE POLL
        </button>
        <button
          type="button"
          onClick={() => setModalMode("event")}
          className="flex items-center gap-1.5 rounded border border-hairline bg-surface px-4 py-2.5 text-[13px] font-semibold text-text transition-colors hover:border-[#333]"
        >
          <Icon name="calendar" size={13} className="text-muted" />
          CREATE EVENT
        </button>
      </div>

      {confirmation && (
        <div className="mb-6 rounded-md border border-accent/25 bg-accent/[0.06] px-3.5 py-2.5 text-[13px] text-accent">
          {confirmation}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="TOTAL MEMBERS" value={formatCompactNumber(communityOverview.totalMembers)} />
        <StatTile label="ACTIVE THIS WEEK" value={formatCompactNumber(communityOverview.activeThisWeek)} />
        <StatTile label="ENGAGEMENT RATE" value={`${communityOverview.engagementRatePct}%`} />
        <StatTile label="NEW MEMBERS" value={`+${communityOverview.newMembersCount}`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <Reveal index={0} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Community Activity</h3>
          <div className="mt-4 flex flex-col divide-y divide-hairline">
            {communityActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                <IconChip icon={ACTIVITY_ICON[item.category] ?? "content"} tone="muted" size={30} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] text-text">{item.detail}</div>
                  <div className="mt-0.5 text-xs text-muted">
                    {item.category} &middot; {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal index={1} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Top Members</h3>
          <div className="mt-4 flex flex-col divide-y divide-hairline">
            {topMembers.map((member, i) => (
              <div key={member.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                <span className="font-display text-xs font-semibold text-faint">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-text">{member.name}</div>
                  <div className="mt-0.5 truncate text-xs text-muted">{member.handle}</div>
                </div>
                <div className="shrink-0 text-right text-xs text-muted">
                  <div>
                    <span className="font-semibold text-text">{member.engagementScore}</span> engagement
                  </div>
                  <div className="mt-0.5">
                    <span className="font-semibold text-text">{member.contributions}</span> contributions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal index={2} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <h3 className="font-display text-lg font-semibold">Top Discussions</h3>
        <div className="mt-4 flex flex-col divide-y divide-hairline">
          {topDiscussions.map((discussion) => (
            <div key={discussion.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <div className="text-sm text-text">{discussion.topic}</div>
                <div className="mt-0.5 text-xs text-muted">
                  {discussion.author} &middot; {discussion.time}
                </div>
              </div>
              <div className="shrink-0 text-right text-xs text-muted">
                <div>
                  <span className="font-semibold text-text">{discussion.replies}</span> replies
                </div>
                <div className="mt-0.5">
                  <span className="font-semibold text-text">{discussion.likes}</span> likes
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="MOST ACTIVE MEMBER" value={topMembers[0].name} />
        <StatTile label="MEMBER GROWTH" value={`+${discordServer.memberDeltaPct}%`} />
        <StatTile
          label="ENGAGEMENT TREND"
          value={`${engagementTrendUp ? "↑" : "↓"} ${communityOverview.engagementRatePct}%`}
        />
        <StatTile label="TOP DISCUSSION TOPIC" value={bestDiscussion.topic} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal index={3} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Community Engagement</h3>
          <p className="mt-1 text-sm text-muted">Engagement rate over the last 30 days.</p>
          <div className="mt-5">
            <LineChart
              series={[{ id: "engagement", color: "#c7ff3d", values: communityEngagementSeries.values }]}
              dates={communityEngagementSeries.dates}
              formatValue={(v) => `${v.toFixed(1)}%`}
              showArea
            />
          </div>
        </Reveal>

        <Reveal index={4} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Member Growth</h3>
          <p className="mt-1 text-sm text-muted">Total members over the last 30 days.</p>
          <div className="mt-5">
            <LineChart
              series={[{ id: "members", color: "#8570db", values: communityMemberGrowthSeries.values }]}
              dates={communityMemberGrowthSeries.dates}
              formatValue={(v) => formatCompactNumber(v)}
              showArea
            />
          </div>
        </Reveal>
      </div>

      <Reveal index={5} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <h3 className="font-display text-lg font-semibold">Community Posts</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg border border-hairline p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-semibold text-text">{post.title}</div>
                <StatusBadge label={post.status} tone={POST_STATUS_TONE[post.status]} />
              </div>
              <div className="mt-2 text-xs text-muted">{post.type}</div>
              <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3 text-xs text-muted">
                <span>{post.engagement}</span>
                <span>{post.comments} comments</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {modalMode && (
        <ComposeModal mode={modalMode} onClose={() => setModalMode(null)} onSubmit={handleComposeSubmit} />
      )}
    </div>
  );
}
