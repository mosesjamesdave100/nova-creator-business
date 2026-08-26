import { useEntrance } from "../hooks/useEntrance";

// Staggered card-reveal for a dashboard page's first paint, reusing the same
// .reveal/.is-in fade-up used on the marketing site, just a shorter stagger
// step since a dashboard has many more cards than a hero.
export function Reveal({ index = 0, stepMs = 60, className = "", children }) {
  const armed = useEntrance();
  return (
    <div
      className={`reveal ${armed ? "is-in" : ""} ${className}`}
      style={{ animationDelay: `${index * stepMs}ms` }}
    >
      {children}
    </div>
  );
}
