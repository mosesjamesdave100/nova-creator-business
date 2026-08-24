import { useState } from "react";
import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { CategoryBarList } from "./CategoryBarList";
import { Reveal } from "./Reveal";
import { creatorProfile } from "../data/creatorProfile";
import { socialLinks } from "../data/socialLinks";
import { PLATFORMS } from "../data/platforms";
import { audiencePlatforms, totalFollowers, totalViews30d, blendedEngagementRatePct } from "../data/audience";
import { ageBreakdown, genderBreakdown, topLocations } from "../data/demographics";
import { sponsorships } from "../data/sponsorships";
import { formatCompactNumber } from "../data/format";

// Deals where the work actually happened, regardless of whether payment has
// settled yet (a Media Kit is a portfolio, not a finance view).
const PAST_PARTNERSHIPS = sponsorships.filter((s) => s.stage === "Paid" || s.stage === "Delivered");

const PUBLIC_PROFILE_PATH = `#/creator/${creatorProfile.username}`;

function StatTile({ label, value }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}

export function MediaKitPage() {
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    const url = `${window.location.origin}${window.location.pathname}${PUBLIC_PROFILE_PATH}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (permissions, insecure context) -
      // fail quietly rather than throwing in front of the creator.
    }
  }

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        A shareable snapshot of your audience and platform stats for brand outreach. Generated from the same data as
        the rest of this dashboard, download it as a PDF or share the link directly.
      </p>

      <Reveal index={0} className="rounded-xl border border-hairline bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-display text-2xl font-semibold text-bg"
              style={{ background: "linear-gradient(135deg, #c7ff3d, #8570db)" }}
            >
              {creatorProfile.avatarInitial}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold md:text-2xl">{creatorProfile.name}</h2>
              <div className="mt-1 text-sm text-muted">{creatorProfile.tagline}</div>
              <div className="mt-1 text-[13px] text-faint">{creatorProfile.location}</div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2 print:hidden">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded border border-[#333] px-3.5 py-2 text-[13px] font-semibold text-text transition-colors hover:border-muted"
            >
              <Icon name={copied ? "check" : "link"} size={14} />
              {copied ? "Profile link copied" : "Share profile"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded bg-accent px-3.5 py-2 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
            >
              <Icon name="print" size={14} />
              Download media kit
            </button>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">{creatorProfile.bio}</p>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="TOTAL REACH" value={formatCompactNumber(totalFollowers)} />
        <StatTile label="VIEWS (30D)" value={formatCompactNumber(totalViews30d)} />
        <StatTile label="ENGAGEMENT RATE" value={`${blendedEngagementRatePct.toFixed(1)}%`} />
        <StatTile label="PLATFORMS" value={audiencePlatforms.length} />
      </div>

      <Reveal index={1} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <h3 className="font-display text-lg font-semibold">Platform Statistics</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiencePlatforms.map((platform) => (
            <div key={platform.id} className="rounded-lg border border-hairline p-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold"
                  style={{ background: `${platform.brandColor}22`, color: platform.brandColor }}
                >
                  {platform.name.charAt(0)}
                </div>
                <div className="text-sm font-semibold text-text">{platform.name}</div>
              </div>
              <div className="mt-3 font-display text-xl font-semibold">{formatCompactNumber(platform.followers)}</div>
              <div className="mt-1 text-xs text-muted">{platform.engagementRatePct}% engagement</div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Reveal index={2} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Age</h3>
          <div className="mt-5">
            <CategoryBarList items={ageBreakdown} formatValue={(v) => `${v}%`} />
          </div>
        </Reveal>
        <Reveal index={3} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Gender</h3>
          <div className="mt-5">
            <CategoryBarList items={genderBreakdown} formatValue={(v) => `${v}%`} />
          </div>
        </Reveal>
        <Reveal index={4} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Top Locations</h3>
          <div className="mt-5">
            <CategoryBarList items={topLocations} formatValue={(v) => `${v}%`} />
          </div>
        </Reveal>
      </div>

      <Reveal index={5} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <h3 className="font-display text-lg font-semibold">Previous Partnerships</h3>
        <div className="mt-4 flex flex-col divide-y divide-hairline">
          {PAST_PARTNERSHIPS.map((deal) => (
            <div key={deal.id} className="flex flex-wrap items-center justify-between gap-2 py-3.5 first:pt-0 last:pb-0">
              <div>
                <div className="text-sm font-semibold text-text">{deal.brand}</div>
                <div className="mt-0.5 text-[13px] text-muted">{deal.campaign}</div>
              </div>
              <div className="text-[13px] text-muted">{deal.deliverables}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal index={6} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Social Links</h3>
          <div className="mt-4 flex flex-col divide-y divide-hairline">
            {socialLinks.map((link) => {
              const platform = PLATFORMS[link.platformId];
              return (
                <a
                  key={link.platformId}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold"
                    style={{ background: `${platform.brandColor}22`, color: platform.brandColor }}
                  >
                    {platform.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-text">{platform.name}</div>
                    <div className="truncate text-xs text-muted">{link.handle}</div>
                  </div>
                  <Icon name="external" size={14} className="shrink-0 text-faint" />
                </a>
              );
            })}
          </div>
        </Reveal>

        <Reveal index={7} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Business Contact</h3>
          <div className="mt-4 flex items-center gap-3.5">
            <IconChip icon="messages" tone="accent" />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-text">For sponsorships and partnerships</div>
              <a href={`mailto:${creatorProfile.businessEmail}`} className="text-[13px] text-accent hover:underline">
                {creatorProfile.businessEmail}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
