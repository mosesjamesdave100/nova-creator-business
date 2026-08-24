import { Nav } from "./Nav";
import { PlaceholderImage } from "./PlaceholderImage";
import { EcosystemStrip } from "./EcosystemStrip";
import { LiveDot } from "./LiveDot";
import { useEntrance } from "../hooks/useEntrance";
import { useParallax } from "../hooks/useParallax";

// ~90ms per step keeps the whole entrance sequence (nav, eyebrow, 3 headline
// lines, image, CTAs, ecosystem strip, 8 steps) at roughly 1s total.
function stagger(armed, index, extraClass = "", stepMs = 90) {
  return {
    className: `reveal ${armed ? "is-in" : ""} ${extraClass}`,
    style: { animationDelay: `${index * stepMs}ms` },
  };
}

export function Hero() {
  const armed = useEntrance();
  const imageParallax = useParallax(7);
  const captionParallax = useParallax(3);

  return (
    <section className="mx-auto max-w-[1600px]">
      <Nav reveal={armed} />

      <div className="grid md:grid-cols-[46fr_54fr]">
        {/* Copy: bottom-anchored so it shares a baseline with the image and
            the ecosystem strip below, instead of floating centered with a
            dead gap beneath it. */}
        <div className="flex flex-col justify-start px-6 pb-10 pt-10 md:justify-end md:px-12 md:pb-14 md:pt-14 lg:px-16 lg:pb-16">
          <div
            {...stagger(
              armed,
              1,
              "font-display text-[11px] tracking-[0.14em] text-accent md:text-[13px] md:tracking-[0.16em]"
            )}
          >
            CREATOR · STREAMER · DIGITAL BRAND
          </div>

          <h1 className="mt-4 font-display text-[44px] font-semibold leading-none tracking-[-0.01em] md:mt-6 md:text-[68px] lg:text-[76px] md:leading-[0.96]">
            {["CREATE.", "CONNECT.", "MONETIZE."].map((line, i) => (
              <span key={line} {...stagger(armed, 2 + i, "block")}>
                {line}
              </span>
            ))}
          </h1>

          <p
            {...stagger(
              armed,
              6,
              "mt-5 max-w-[380px] text-[15px] leading-relaxed text-muted md:mt-8 md:text-[17px]"
            )}
          >
            Content, community and everything in between, all in one place.
          </p>

          <div {...stagger(armed, 7, "mt-7 hidden flex-wrap gap-4 md:mt-10 md:flex")}>
            <a
              href="#"
              className="rounded bg-accent px-6 py-[15px] text-sm font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-100"
            >
              WATCH LATEST →
            </a>
            <a
              href="#"
              className="rounded border border-[#333] px-6 py-[15px] text-sm font-semibold text-text transition-colors hover:border-muted"
            >
              EXPLORE NOVA
            </a>
          </div>
        </div>

        {/* Visual: the creator portrait is the hero's major anchor. The
            corner-cut silhouette and off-center 46/54 split are the "break
            the grid" cue; a soft ambient shadow (on this unclipped wrapper)
            gives it depth without a glow effect. */}
        <div
          data-parallax-root
          {...stagger(
            armed,
            5,
            "relative h-[440px] shadow-[0_60px_120px_-60px_rgba(0,0,0,0.85)] md:h-[560px] lg:h-[640px] xl:h-[700px]"
          )}
        >
          <div className="creator-frame absolute inset-0 overflow-hidden">
            <div ref={imageParallax} className="absolute inset-[-4%]">
              <PlaceholderImage
                label="Creator portrait, placeholder"
                note="Portrait crop ~4:5. Cinematic, low-key lighting. Confident, editorial, not an esports pose. Leave dark negative space bottom-left for the live caption."
              />
            </div>

            {/* Edge fades: left into the copy column, top and bottom for
                legibility of the on-image captions. No decorative glow. */}
            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,0)_20%)] md:block" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.45)_0%,rgba(8,8,8,0)_20%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,8,0.75)_0%,rgba(8,8,8,0)_38%)]" />

            {/* Live status: a caption on the photo, not a floating card. */}
            <div
              ref={captionParallax}
              className="absolute bottom-5 left-5 [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] md:bottom-8 md:left-8"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-accent md:text-xs">
                <LiveDot size={5} />
                LIVE · 12.4K WATCHING
              </div>
              <a
                href="#"
                className="mt-1.5 hidden text-xs font-semibold text-text hover:text-accent md:inline-block"
              >
                WATCH LIVE →
              </a>
            </div>

            {/* Drop tag: same treatment, opposite corner, desktop only. */}
            <div className="absolute right-8 top-8 hidden text-right [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] md:block">
              <div className="text-[10px] tracking-[0.1em] text-muted">LATEST DROP</div>
              <div className="mt-1 text-[13px] font-semibold text-text">NOVA // 001</div>
              <a href="#" className="text-[11px] font-semibold text-accent hover:underline">
                EXPLORE →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div {...stagger(armed, 8)}>
        <div className="px-6 py-6 md:hidden">
          <a
            href="#"
            className="block rounded bg-accent px-4 py-[15px] text-center text-sm font-semibold text-bg"
          >
            WATCH LATEST →
          </a>
          <div className="mt-5">
            <EcosystemStrip compact />
          </div>
        </div>
        <div className="hidden md:block">
          <EcosystemStrip />
        </div>
      </div>
    </section>
  );
}
