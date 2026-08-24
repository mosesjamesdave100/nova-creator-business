import { Icon } from "../../dashboard/Icon";
import { PLATFORMS, CONNECTABLE_PROVIDER_IDS } from "../../data/platforms";

export function StepConnect({ connected, onToggle }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1 flex items-center gap-2 rounded-md border border-hairline bg-surface-2 px-3.5 py-2.5 text-[13px] text-muted">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        These are mock connections for this preview. You can connect real accounts anytime from Integrations.
      </div>

      {CONNECTABLE_PROVIDER_IDS.map((id) => {
        const platform = PLATFORMS[id];
        const isConnected = connected.includes(id);
        return (
          <div
            key={id}
            className="flex items-center gap-3.5 rounded-xl border border-hairline bg-surface p-4"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold"
              style={{ background: `${platform.brandColor}22`, color: platform.brandColor }}
            >
              {platform.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-text">{platform.name}</div>
              <div className="mt-0.5 text-[13px] text-muted">{isConnected ? "Connected" : "Not connected"}</div>
            </div>
            <button
              type="button"
              onClick={() => onToggle(id)}
              className={`flex shrink-0 items-center gap-1.5 rounded border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                isConnected
                  ? "border-[#333] text-text hover:border-muted"
                  : "border-transparent bg-accent text-bg hover:scale-[1.02]"
              }`}
            >
              {isConnected && <Icon name="check" size={13} />}
              {isConnected ? "Connected" : "Connect"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
