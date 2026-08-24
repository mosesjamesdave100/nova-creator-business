import { SectionHeading } from "../landing/SectionHeading";
import { PlaceholderImage } from "../PlaceholderImage";
import { topContent, FORMAT_LABELS } from "../../data/content";
import { formatCompactNumber } from "../../data/format";

const FEATURED = topContent.slice(0, 4);

export function ProfileContent() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-20 lg:px-16">
      <SectionHeading eyebrow="02 — CONTENT" heading="Recent highlights" />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED.map((item) => (
          <div key={item.id} className="group">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-hairline">
              <PlaceholderImage label="Thumbnail" />
            </div>
            <div className="mt-3 text-sm font-medium leading-snug text-text">{item.title}</div>
            <div className="mt-1.5 flex items-center gap-2 text-[12px] text-muted">
              <span>{FORMAT_LABELS[item.format]}</span>
              <span className="text-faint">&middot;</span>
              <span>{formatCompactNumber(item.views)} views</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
