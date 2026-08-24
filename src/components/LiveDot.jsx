export function LiveDot({ size = 7, className = "" }) {
  return (
    <span
      className={`inline-block shrink-0 animate-live-pulse rounded-full bg-accent ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
