const PLATFORMS = [
  { label: "YOUTUBE", shortLabel: "YT", value: "250K" },
  { label: "TWITCH", shortLabel: "TWITCH", value: "82K" },
  { label: "TIKTOK", shortLabel: "TIKTOK", value: "410K" },
  { label: "COMMUNITY", shortLabel: "COMM.", value: "18K" },
];

// Reads as creator credentials (a masthead line), not dashboard stat tiles:
// hairline dividers, quiet caption above a Space Grotesk figure.
export function EcosystemStrip({ compact = false }) {
  if (compact) {
    return (
      <div className="flex divide-x divide-hairline border-t border-hairline pt-5">
        {PLATFORMS.map((platform) => (
          <div key={platform.label} className="flex-1 text-center first:pl-0">
            <div className="text-[9px] tracking-[0.1em] text-muted">{platform.shortLabel}</div>
            <div className="mt-1 font-display text-sm font-semibold">{platform.value}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-t border-hairline px-8 py-7 md:px-12">
      <div className="flex divide-x divide-hairline">
        {PLATFORMS.map((platform) => (
          <div key={platform.label} className="px-9 first:pl-0 md:px-12">
            <div className="text-[11px] tracking-[0.1em] text-muted">{platform.label}</div>
            <div className="mt-1.5 font-display text-lg font-semibold">{platform.value}</div>
          </div>
        ))}
      </div>
      <div className="hidden text-[11px] text-faint sm:block">Demo figures for presentation</div>
    </div>
  );
}
