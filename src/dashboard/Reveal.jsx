import { useState } from "react";
import { useEntrance } from "../hooks/useEntrance";

// Staggered card-reveal for a dashboard page's first paint, reusing the same
// .reveal/.is-in fade-up used on the marketing site, just a shorter stagger
// step since a dashboard has many more cards than a hero. Swaps to .is-done
// once the animation finishes so the retained `transform` from
// animation-fill-mode: forwards doesn't linger - a lingering transform turns
// this element into a CSS containing block, which would trap any
// `position: fixed` modal rendered anywhere inside it (see index.css).
export function Reveal({ index = 0, stepMs = 60, className = "", children }) {
  const armed = useEntrance();
  const [done, setDone] = useState(false);
  return (
    <div
      className={`reveal ${done ? "is-done" : armed ? "is-in" : ""} ${className}`}
      style={{ animationDelay: `${index * stepMs}ms` }}
      onAnimationEnd={() => setDone(true)}
    >
      {children}
    </div>
  );
}
