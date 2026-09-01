import { PLATFORMS, CONNECTABLE_PROVIDER_IDS } from "../../data/platforms";

// Deliberately not interactive - there's no OAuth yet (Phase 2B), so this
// step only ever shows the real, honest state every new signup actually
// has: nothing connected. No button here fakes a connection the way a
// clickable "Connect" toggle would.
export function StepConnect() {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1 flex items-center gap-2 rounded-md border border-hairline bg-surface-2 px-3.5 py-2.5 text-[13px] text-muted">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        Real platform connections are coming in a future NOVA update. You can revisit this anytime from Integrations.
      </div>

      {CONNECTABLE_PROVIDER_IDS.map((id) => {
        const platform = PLATFORMS[id];
        return (
          <div key={id} className="flex items-center gap-3.5 rounded-xl border border-hairline bg-surface p-4">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold"
              style={{ background: `${platform.brandColor}22`, color: platform.brandColor }}
            >
              {platform.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-text">{platform.name}</div>
              <div className="mt-0.5 text-[13px] text-muted">Not connected</div>
            </div>
            <span className="shrink-0 rounded bg-surface-2 px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-faint">
              COMING SOON
            </span>
          </div>
        );
      })}
    </div>
  );
}
