export function ComingSoon({ title }) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="font-display text-sm tracking-[0.1em] text-muted">COMING SOON</div>
      <h2 className="mt-3 font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">
        This section isn't built yet. The Overview dashboard is the first page in production.
      </p>
    </div>
  );
}
