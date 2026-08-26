// Shared reveal-on-scroll stagger helper for landing sections.
export function stagger(inView, index, extraClass = "", stepMs = 90) {
  return {
    className: `reveal ${inView ? "is-in" : ""} ${extraClass}`,
    style: { animationDelay: `${index * stepMs}ms` },
  };
}
