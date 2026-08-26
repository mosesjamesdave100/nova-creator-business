import { LiveDot } from "./LiveDot";
import { PlaceholderImage } from "./PlaceholderImage";
import { useInView } from "../hooks/useInView";

const ACTIVITY = [
  { label: "NEW VIDEO", copy: "I Tried Winning With The Worst Loadout" },
  { label: "NEW CLIP", copy: "That reaction was insane" },
  { label: "COMMUNITY", copy: "Tournament registrations are open." },
];

function stagger(inView, index, extraClass = "", stepMs = 90) {
  return {
    className: `reveal ${inView ? "is-in" : ""} ${extraClass}`,
    style: { animationDelay: `${index * stepMs}ms` },
  };
}

// The primary visual of the section: an immersive media block with the
// title overlaid on the image, editorial-feature style, rather than a
// thumbnail sitting above a separate text panel.
function FeaturedVideo({ inView }) {
  return (
    <div
      {...stagger(
        inView,
        2,
        "creator-frame group relative h-[300px] overflow-hidden shadow-[0_50px_100px_-55px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-[1.02] md:h-[440px] lg:h-[500px]"
      )}
    >
      <PlaceholderImage
        ratio="16:9"
        label="Featured video, placeholder"
        note="16:9 cinematic still from the episode. Leave room bottom-left for the overlaid title."
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,8,0.9)_0%,rgba(8,8,8,0.15)_50%,rgba(8,8,8,0)_75%)]" />

      <button
        type="button"
        aria-label="Watch video"
        className="absolute left-1/2 top-[42%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-sm backdrop-blur-[2px] transition-transform group-hover:scale-105"
      >
        ▶
      </button>

      <div className="absolute inset-x-0 bottom-0 px-6 pb-6 md:px-9 md:pb-8">
        <div className="text-xs tracking-[0.08em] text-muted">NOVA // EP. 047</div>
        <div className="mt-2 max-w-[560px] font-display text-xl font-semibold leading-tight md:text-3xl">
          "I Tried Winning With The Worst Loadout"
        </div>
        <div className="mt-4 flex items-center gap-5">
          <div className="text-[13px] text-muted">1.2M views · 3 days ago</div>
          <a href="#" className="text-[13px] font-semibold text-text hover:text-accent">
            WATCH VIDEO →
          </a>
        </div>
      </div>
    </div>
  );
}

// Same slot serves the live broadcast and the next-scheduled-stream state.
// This is the one element in the section allowed to read as a UI card, since
// it represents live system status rather than editorial content.
function LivePanel({ inView, status = "live" }) {
  return (
    <div {...stagger(inView, 3, "flex flex-col bg-surface p-6 md:p-8")}>
      {status === "live" ? (
        <>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.06em] text-accent">
            <LiveDot size={6} />
            LIVE NOW
          </div>
          <div className="flex flex-1 flex-col justify-center py-8">
            <div className="mb-1.5 font-display text-xl font-semibold">NOVA IS LIVE</div>
            <div className="mb-7 text-sm text-muted">Valorant Ranked Grind</div>
            <div className="font-display text-4xl font-semibold leading-none text-accent">12.4K</div>
            <div className="mt-1 text-xs tracking-[0.04em] text-muted">WATCHING NOW</div>
          </div>
          <a
            href="#"
            className="rounded bg-accent py-3.5 text-center text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
          >
            WATCH LIVE →
          </a>
        </>
      ) : (
        <>
          <div className="text-xs font-semibold tracking-[0.06em] text-muted">NEXT STREAM</div>
          <div className="flex flex-1 flex-col justify-center py-8">
            <div className="mb-1.5 font-display text-xl font-semibold">Friday · 8:00 PM</div>
            <div className="text-sm text-muted">Valorant Ranked</div>
          </div>
          <a
            href="#"
            className="rounded border border-[#333] py-3.5 text-center text-[13px] font-semibold text-text hover:border-muted"
          >
            ADD REMINDER →
          </a>
        </>
      )}
    </div>
  );
}

function NextUp({ inView }) {
  return (
    <div {...stagger(inView, 4)}>
      <div className="mb-2.5 text-xs tracking-[0.06em] text-muted">NEXT UP</div>
      <div className="mb-1.5 font-display text-[17px] font-semibold">FRIDAY · 8:00 PM</div>
      <div className="mb-3.5 text-sm text-muted">Ranked Night with the community.</div>
      <a href="#" className="text-[13px] font-semibold hover:text-accent">
        ADD TO CALENDAR →
      </a>
    </div>
  );
}

function LatestActivity({ inView }) {
  return (
    <div {...stagger(inView, 5)}>
      <div className="mb-3.5 text-xs tracking-[0.06em] text-muted">LATEST</div>
      <div className="flex flex-col gap-3.5">
        {ACTIVITY.map((item) => (
          <div key={item.label} className="flex gap-4 text-sm">
            <span className="w-[90px] shrink-0 font-semibold text-accent">{item.label}</span>
            <span className="text-text">{item.copy}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhatsHappeningNow() {
  const [ref, inView] = useInView();

  return (
    <section id="whats-happening" ref={ref} className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
      <div {...stagger(inView, 0, "font-display text-xs tracking-[0.12em] text-muted")}>
        02 / NOW
      </div>
      <h2
        {...stagger(
          inView,
          1,
          "mt-3 font-display text-[34px] font-semibold leading-[1.05] md:text-[44px]"
        )}
      >
        WHAT'S
        <br />
        HAPPENING NOW
      </h2>
      <p {...stagger(inView, 1, "mb-10 mt-3 max-w-[420px] text-[15px] text-muted md:mb-14 md:text-base")}>
        The latest from the NOVA universe.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.7fr_1fr]">
        <FeaturedVideo inView={inView} />
        <LivePanel inView={inView} status="live" />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 border-t border-hairline pt-10 md:grid-cols-[1fr_2fr] md:pt-12">
        <NextUp inView={inView} />
        <LatestActivity inView={inView} />
      </div>
    </section>
  );
}
