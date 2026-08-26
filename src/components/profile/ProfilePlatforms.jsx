import { SectionHeading } from "../landing/SectionHeading";
import { audiencePlatforms } from "../../data/audience";
import { formatCompactNumber } from "../../data/format";

export function ProfilePlatforms() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-20 lg:px-16">
      <SectionHeading eyebrow="01 — PLATFORMS" heading="Where to find me" />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {audiencePlatforms.map((platform) => (
          <div key={platform.id} className="rounded-xl border border-hairline bg-surface p-6">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold"
              style={{ background: `${platform.brandColor}22`, color: platform.brandColor }}
            >
              {platform.name.charAt(0)}
            </div>
            <div className="mt-4 text-sm font-semibold text-text">{platform.name}</div>
            <div className="mt-3 font-display text-2xl font-semibold leading-none">
              {formatCompactNumber(platform.followers)}
            </div>
            <div className="mt-2 text-[13px] text-muted">{platform.engagementRatePct}% engagement</div>
          </div>
        ))}
      </div>
    </section>
  );
}
