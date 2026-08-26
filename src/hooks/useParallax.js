import { useEffect, useRef } from "react";

// Cursor-driven parallax, capped at `max` px. Used only on the hero visual.
// No-op on touch devices and for reduced-motion users, per the design
// direction's "maximum movement approximately 5-8px, no excessive 3D".
export function useParallax(max = 6) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isCoarsePointer) return;

    const container = node.closest("[data-parallax-root]") || node.parentElement;
    if (!container) return;

    function handlePointerMove(event) {
      const rect = container.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.transform = `translate3d(${-px * max}px, ${-py * max}px, 0)`;
    }

    function handlePointerLeave() {
      node.style.transform = "translate3d(0, 0, 0)";
    }

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [max]);

  return ref;
}
