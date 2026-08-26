import { useEffect, useRef, useState } from "react";

// Animates a number from 0 up to `value` once, on mount, running it through
// `format` every frame so callers can pass a plain number and get back a
// ready-to-render string ("$4,280.45", "128.7K", ...). Respects
// prefers-reduced-motion by jumping straight to the final value.
export function useCountUp(value, { duration = 900, format = (n) => `${Math.round(n)}` } = {}) {
  const [display, setDisplay] = useState(() => format(0));
  const frameRef = useRef(null);

  useEffect(() => {
    if (!Number.isFinite(value)) {
      setDisplay(format(0));
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplay(format(value));
      return;
    }

    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(format(value * eased));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return display;
}
