import { useEffect, useState } from "react";

// Fires once on mount, a frame later, so the CSS transition/animation
// actually runs instead of starting in its end state.
export function useEntrance() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return armed;
}
