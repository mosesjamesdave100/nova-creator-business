import { Link } from "react-router-dom";
import { PlaceholderImage } from "../PlaceholderImage";
import { LiveDot } from "../LiveDot";
import { PLATFORMS } from "../../data/platforms";
import { socialLinks } from "../../data/socialLinks";
import { creatorProfile } from "../../data/creatorProfile";
import { liveStatus } from "../../data/mockData";
import { useEntrance } from "../../hooks/useEntrance";
import { stagger } from "../landing/stagger";

export function ProfileHero() {
  const armed = useEntrance();

  return (
    <section className="mx-auto max-w-[1600px]">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-5 md:px-10">
        <Link to="/" className="font-display text-lg font-bold tracking-[0.02em]">
          NOVA
        </Link>
        <Link
          to="/dashboard"
          className="rounded border border-[#333] px-4 py-2 text-[12px] font-semibold tracking-[0.04em] text-text transition-colors hover:border-accent hover:text-accent"
        >
          OPEN NOVA →
        </Link>
      </div>

      <div className="grid md:grid-cols-[46fr_54fr]">
        <div className="flex flex-col justify-start px-6 pb-10 pt-10 md:justify-end md:px-12 md:pb-14 md:pt-14 lg:px-16 lg:pb-16">
          <div {...stagger(armed, 1, "font-display text-[11px] tracking-[0.14em] text-accent md:text-[13px] md:tracking-[0.16em]")}>
            {creatorProfile.tagline.toUpperCase()}
          </div>

          <h1 {...stagger(armed, 2, "mt-4 font-display text-[44px] font-semibold leading-none tracking-[-0.01em] md:mt-6 md:text-[68px] lg:text-[76px] md:leading-[0.96]")}>
            {creatorProfile.name}
          </h1>

          <p {...stagger(armed, 3, "mt-5 max-w-[420px] text-[15px] leading-relaxed text-muted md:mt-8 md:text-[17px]")}>
            {creatorProfile.bio}
          </p>

          <div {...stagger(armed, 4, "mt-2 text-[13px] text-faint")}>{creatorProfile.location}</div>

          <div {...stagger(armed, 5, "mt-7 flex flex-wrap gap-3 md:mt-9")}>
            {socialLinks.map((link) => {
              const platform = PLATFORMS[link.platformId];
              return (
                <a
                  key={link.platformId}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-transform hover:scale-105"
                  style={{ background: `${platform.brandColor}22`, color: platform.brandColor }}
                  title={`${platform.name}, ${link.handle}`}
                >
                  {platform.name.charAt(0)}
                </a>
              );
            })}
          </div>

          <div {...stagger(armed, 6, "mt-7 flex flex-wrap gap-4 md:mt-10")}>
            <a
              href="#partner"
              className="rounded bg-accent px-6 py-[15px] text-sm font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-100"
            >
              WORK WITH ME →
            </a>
            <a
              href="#/media-kit"
              className="rounded border border-[#333] px-6 py-[15px] text-sm font-semibold text-text transition-colors hover:border-muted"
            >
              VIEW MEDIA KIT
            </a>
          </div>
        </div>

        <div
          data-parallax-root
          {...stagger(armed, 5, "relative h-[380px] shadow-[0_60px_120px_-60px_rgba(0,0,0,0.85)] md:h-[520px] lg:h-[600px]")}
        >
          <div className="creator-frame absolute inset-0 overflow-hidden">
            <PlaceholderImage
              label="Creator portrait, placeholder"
              note="Portrait crop ~4:5. Cinematic, low-key lighting."
            />
            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,0)_20%)] md:block" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,8,0.75)_0%,rgba(8,8,8,0)_38%)]" />

            {liveStatus.isLive && (
              <div className="absolute bottom-5 left-5 [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] md:bottom-8 md:left-8">
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-accent md:text-xs">
                  <LiveDot size={5} />
                  LIVE ON {liveStatus.platform.toUpperCase()} · {liveStatus.watching} WATCHING
                </div>
              </div>
            )}

            <div className="absolute right-6 top-6 hidden md:block">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full font-display text-base font-semibold text-bg"
                style={{ background: "linear-gradient(135deg, #c7ff3d, #8570db)" }}
              >
                {creatorProfile.avatarInitial}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
