import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { StatusBadge } from "./StatusBadge";
import { PROVIDERS } from "../integrations";
import { CONNECTION_STATE, CONNECTION_STATE_LABEL, DEMO_MODE } from "../data/connections";
import { audiencePlatforms } from "../data/audience";
import { discordServer } from "../data/community";
import { totalRevenue30d as shopRevenue30d, totalOrders30d } from "../data/shop";
import { totalRevenue30d as businessRevenue30d } from "../data/revenue";
import { formatCompactNumber, currencyWhole } from "../data/format";

// Key metrics per provider, one line worth glancing at without opening the
// full Analytics/Revenue page. Derived from the same data those pages read,
// never a second copy, so a connected card can't silently drift from them.
function providerMetrics(id) {
  const platform = audiencePlatforms.find((p) => p.id === id);
  if (platform) {
    return [
      `${formatCompactNumber(platform.followers)} followers`,
      `${formatCompactNumber(platform.views30d)} views (30d)`,
    ];
  }
  if (id === "discord") {
    return [`${formatCompactNumber(discordServer.memberCount)} members`, `${discordServer.onlineCount} online now`];
  }
  if (id === "shopify") {
    return [`${currencyWhole.format(shopRevenue30d)} revenue (30d)`, `${totalOrders30d} orders (30d)`];
  }
  if (id === "stripe") {
    return [`${currencyWhole.format(businessRevenue30d)} processed (30d)`];
  }
  return [];
}

const STATE_TONE = {
  [CONNECTION_STATE.CONNECTED]: "good",
  [CONNECTION_STATE.NEEDS_ATTENTION]: "warning",
  [CONNECTION_STATE.NOT_CONNECTED]: "muted",
};

const ACTION_LABEL = {
  [CONNECTION_STATE.CONNECTED]: "Disconnect",
  [CONNECTION_STATE.NEEDS_ATTENTION]: "Reconnect",
  [CONNECTION_STATE.NOT_CONNECTED]: "Connect",
};

function ProviderCard({ entry, status, metrics, onAction }) {
  if (!status) {
    return (
      <div className="rounded-xl border border-hairline bg-surface p-5">
        <div className="h-5 w-24 animate-pulse rounded bg-surface-2" />
        <div className="mt-4 h-4 w-32 animate-pulse rounded bg-surface-2" />
      </div>
    );
  }

  const isPrimaryAction = status.state !== CONNECTION_STATE.CONNECTED;

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold"
            style={{ background: `${status.brandColor}22`, color: status.brandColor }}
          >
            {status.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-text">{status.name}</div>
            <div className="text-xs text-muted">
              {status.state === CONNECTION_STATE.NOT_CONNECTED
                ? "Not connected"
                : status.accountLabel}
            </div>
          </div>
        </div>
        <StatusBadge label={CONNECTION_STATE_LABEL[status.state]} tone={STATE_TONE[status.state]} />
      </div>

      {status.state === CONNECTION_STATE.NEEDS_ATTENTION && (
        <div className="mt-4 rounded-md border border-warning/25 bg-warning/10 px-3 py-2.5 text-[13px] text-warning">
          {status.detail}
        </div>
      )}

      {status.state !== CONNECTION_STATE.NOT_CONNECTED && metrics.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-4">
          {metrics.map((metric) => (
            <div key={metric} className="text-[13px] font-semibold text-text">
              {metric}
            </div>
          ))}
        </div>
      )}

      {status.state === CONNECTION_STATE.CONNECTED && (
        <div className="mt-4 text-xs text-faint">Last synced {status.lastSynced}</div>
      )}

      <button
        type="button"
        onClick={() => onAction(entry.key, status.state)}
        className={`mt-4 w-full rounded border py-2.5 text-[13px] font-semibold transition-colors ${
          isPrimaryAction
            ? "border-transparent bg-accent text-bg hover:scale-[1.02]"
            : "border-[#333] text-text hover:border-muted"
        }`}
      >
        {ACTION_LABEL[status.state]}
      </button>
    </div>
  );
}

export function IntegrationsPage() {
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(PROVIDERS.map((entry) => entry.module.getConnectionStatus())).then((results) => {
      if (cancelled) return;
      const next = {};
      PROVIDERS.forEach((entry, i) => {
        next[entry.key] = results[i];
      });
      setStatuses(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleAction(key, currentState) {
    setStatuses((prev) => {
      const wasConnected = currentState === CONNECTION_STATE.CONNECTED;
      return {
        ...prev,
        [key]: {
          ...prev[key],
          state: wasConnected ? CONNECTION_STATE.NOT_CONNECTED : CONNECTION_STATE.CONNECTED,
          accountLabel: wasConnected ? null : prev[key].accountLabel,
        },
      };
    });
  }

  const needsAttentionCount = Object.values(statuses).filter(
    (s) => s.state === CONNECTION_STATE.NEEDS_ATTENTION,
  ).length;

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <p className="mb-4 max-w-2xl text-sm text-muted">
        Connect the platforms NOVA pulls data from. These are mock connections for this prototype (acting on one only
        changes what's shown here), a real integration would run OAuth against each provider and swap the adapters in{" "}
        <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">src/integrations/</code>.
      </p>

      {DEMO_MODE && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-hairline bg-surface-2 px-3.5 py-2.5 text-[13px] text-muted">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          Demo mode: every number in this dashboard is mock data. Connecting a provider here does not yet pull real
          account data.
        </div>
      )}

      {needsAttentionCount > 0 && (
        <div className="mb-6 rounded-md border border-warning/25 bg-warning/10 px-3.5 py-2.5 text-[13px] text-warning">
          {needsAttentionCount} connection{needsAttentionCount > 1 ? "s" : ""} need{needsAttentionCount === 1 ? "s" : ""}{" "}
          attention.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROVIDERS.map((entry, i) => (
          <Reveal key={entry.key} index={i}>
            <ProviderCard
              entry={entry}
              status={statuses[entry.key]}
              metrics={providerMetrics(entry.key)}
              onAction={handleAction}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
