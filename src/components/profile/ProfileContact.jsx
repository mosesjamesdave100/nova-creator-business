import { Icon } from "../../dashboard/Icon";
import { creatorProfile } from "../../data/creatorProfile";

export function ProfileContact() {
  return (
    <section id="partner" className="mx-auto max-w-[1600px] px-6 pb-20 pt-4 md:px-12 lg:px-16">
      <div className="rounded-2xl border border-hairline bg-surface px-6 py-10 md:px-14 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="font-display text-xs tracking-[0.12em] text-muted">05 — WORK WITH ME</div>
          <h2 className="mt-3 text-balance font-display text-[32px] font-semibold leading-[1.05] md:text-[40px]">
            Interested in partnering with {creatorProfile.name}?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted md:text-base">
            For sponsorships, brand deals and collaborations, reach out directly or pull the full audience breakdown
            from the media kit.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${creatorProfile.businessEmail}`}
              className="flex items-center gap-2 rounded bg-accent px-6 py-[15px] text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
            >
              <Icon name="messages" size={15} />
              {creatorProfile.businessEmail}
            </a>
            <a
              href="#/media-kit"
              className="flex items-center gap-2 rounded border border-[#333] px-6 py-[15px] text-sm font-semibold text-text transition-colors hover:border-muted"
            >
              <Icon name="mediaKit" size={15} />
              VIEW FULL MEDIA KIT
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
