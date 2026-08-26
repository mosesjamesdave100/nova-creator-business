import { useInView } from "../../hooks/useInView";
import { stagger } from "./stagger";

// Shared eyebrow/heading/copy block, kept identical across every landing
// section (numbered eyebrow, Space Grotesk heading, muted supporting line)
// so the eight new sections read as one system rather than eight one-offs.
export function SectionHeading({ eyebrow, heading, copy, align = "left", children }) {
  const [ref, inView] = useInView();

  return (
    <div ref={ref} className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div {...stagger(inView, 0, "font-display text-xs tracking-[0.12em] text-muted")}>{eyebrow}</div>
      <h2
        {...stagger(
          inView,
          1,
          "mt-3 text-balance font-display text-[32px] font-semibold leading-[1.05] md:text-[44px]"
        )}
      >
        {heading}
      </h2>
      {copy && (
        <p {...stagger(inView, 2, "mt-4 text-[15px] leading-relaxed text-muted md:text-base")}>{copy}</p>
      )}
      {children}
    </div>
  );
}
