export function CommunityCTA() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-hairline bg-surface">
      <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr]">
        <div className="p-6 md:p-8">
          <h3 className="font-display text-xl font-semibold md:text-2xl">Build a stronger community</h3>
          <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted">
            Create exclusive content and grow closer with your biggest fans.
          </p>
          <a
            href="#"
            className="mt-6 inline-block rounded bg-accent px-5 py-3 text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
          >
            CREATE MEMBERSHIP →
          </a>
        </div>

        <div className="grain relative hidden min-h-[160px] overflow-hidden sm:block">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#111111_0%,rgba(17,17,17,0)_35%)] z-10" />
          {/* Three overlapping soft glows, standing in for figures around a
              stage - abstract, not literal, so it stays restrained. */}
          <div
            className="absolute h-28 w-28 rounded-full opacity-70 blur-2xl"
            style={{ background: "#c7ff3d", left: "20%", top: "30%" }}
          />
          <div
            className="absolute h-32 w-32 rounded-full opacity-60 blur-2xl"
            style={{ background: "#8570db", left: "45%", top: "15%" }}
          />
          <div
            className="absolute h-24 w-24 rounded-full opacity-60 blur-2xl"
            style={{ background: "#2fa0c9", left: "62%", top: "45%" }}
          />
          <div className="absolute inset-0 bg-surface/40" />
        </div>
      </div>
    </div>
  );
}
