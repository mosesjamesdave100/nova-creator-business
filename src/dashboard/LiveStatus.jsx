import { LiveDot } from "../components/LiveDot";
import { Icon } from "./Icon";
import { liveStatus } from "../data/mockData";
import { PLATFORMS } from "../data/platforms";

export function LiveStatus() {
  const platformMeta = Object.values(PLATFORMS).find((p) => p.name === liveStatus.platform);

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      {liveStatus.isLive ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.06em] text-accent">
              <LiveDot size={6} />
              LIVE ON {liveStatus.platform.toUpperCase()}
            </div>
            {platformMeta && (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ background: `${platformMeta.brandColor}26` }}
              >
                <Icon name="play" size={12} style={{ color: platformMeta.brandColor }} />
              </div>
            )}
          </div>
          <div className="mt-3 font-display text-lg font-semibold">You're live on {liveStatus.platform}</div>
          <div className="mt-1 text-sm text-muted">{liveStatus.watching} watching</div>
          <a
            href="#"
            className="mt-4 block rounded bg-accent py-3 text-center text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
          >
            GO TO STREAM →
          </a>
        </>
      ) : (
        <>
          <div className="text-xs font-semibold tracking-[0.06em] text-muted">OFFLINE</div>
          <div className="mt-3 font-display text-lg font-semibold">You're not live right now</div>
          <a
            href="#"
            className="mt-4 block rounded border border-[#333] py-3 text-center text-[13px] font-semibold text-text hover:border-muted"
          >
            GO LIVE →
          </a>
        </>
      )}
    </div>
  );
}
