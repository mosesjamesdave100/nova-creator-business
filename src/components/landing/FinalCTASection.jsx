import { Link } from "react-router-dom";
import { useInView } from "../../hooks/useInView";
import { stagger } from "./stagger";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function FinalCTASection() {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="mx-auto max-w-[1600px] px-6 pb-24 text-center md:px-12 md:pb-32">
      <h2
        {...stagger(
          inView,
          0,
          "text-balance font-display text-[32px] font-semibold leading-[1.1] md:text-[48px]"
        )}
      >
        STOP MANAGING YOUR CREATOR BUSINESS
        <br />
        IN SIX DIFFERENT PLACES.
      </h2>
      <p {...stagger(inView, 1, "mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted md:text-base")}>
        Bring your content, audience, community and revenue together.
      </p>
      <div {...stagger(inView, 2, "mt-9 flex flex-wrap items-center justify-center gap-4")}>
        <Link
          to="/dashboard"
          className="rounded bg-accent px-6 py-[15px] text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          BUILD YOUR CREATOR BUSINESS →
        </Link>
        <button
          type="button"
          onClick={scrollToTop}
          className="rounded border border-[#333] px-6 py-[15px] text-sm font-semibold text-text transition-colors hover:border-muted"
        >
          EXPLORE NOVA →
        </button>
      </div>
    </section>
  );
}
