import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { StatusBadge } from "./StatusBadge";
import { PageLinkButton } from "./PageLinkButton";
import { Icon } from "./Icon";
import { PLATFORMS, CONNECTABLE_PROVIDER_IDS } from "../data/platforms";
import { DEMO_MODE } from "../data/connections";
import { audiencePlatforms } from "../data/audience";
import { discordServer } from "../data/community";
import { totalRevenue30d as shopRevenue30d, totalOrders30d } from "../data/shop";
import { totalRevenue30d as businessRevenue30d } from "../data/revenue";
import { formatCompactNumber, currencyWhole } from "../data/format";
import { useAuth } from "../context/AuthContext";
import { listConnectedAccounts } from "../services/connectedAccountsService";

// Key metrics per provider, one line worth glancing at without opening the
// full Analytics/Revenue page. Derived from the same data those pages read,
// never a second copy, so a connected card can't silently drift from them.
// This stays demo data (per NOVA's existing demo dashboard) independent of
// whether the platform is actually connected - see the real connection state
// below, which is what determines whether a card shows as connected at all.
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

// Real OAuth doesn't exist yet, so this modal is the honest destination for
// every "Connect"/"Manage" click - mirrors the same coming-soon modal already
// used in Settings -> Connected Accounts, rather than faking a successful
// connection the way toggling local state would.
function ComingSoonModal({ platformName, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-xl border border-hairline bg-surface-2 p-6 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
        <Icon name="alert" size={22} className="mx-auto text-accent" />
        <h3 className="mt-3 font-display text-base font-semibold">Connect {platformName}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Account connection will be available when NOVA's platform integrations are enabled.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded bg-accent py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function ProviderCard({ platform, status, metrics, onAction }) {
  if (!status) {
    return (
      <div className="rounded-xl border border-hairline bg-surface p-5">
        <div className="h-5 w-24 animate-pulse rounded bg-surface-2" />
        <div className="mt-4 h-4 w-32 animate-pulse rounded bg-surface-2" />
      </div>
    );
  }

  const { connected, accountLabel } = status;

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold"
            style={{ background: `${platform.brandColor}22`, color: platform.brandColor }}
          >
            {platform.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-text">{platform.name}</div>
            <div className="text-xs text-muted">{connected ? accountLabel || "Connected" : "Not connected"}</div>
          </div>
        </div>
        <StatusBadge label={connected ? "Connected" : "Not connected"} tone={connected ? "good" : "muted"} />
      </div>

      {connected && metrics.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-4">
          {metrics.map((metric) => (
            <div key={metric} className="text-[13px] font-semibold text-text">
              {metric}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => onAction(platform.name)}
        className={`mt-4 w-full rounded border py-2.5 text-[13px] font-semibold transition-colors ${
          connected ? "border-[#333] text-text hover:border-muted" : "border-transparent bg-accent text-bg hover:scale-[1.02]"
        }`}
      >
        {connected ? "Manage" : "Connect"}
      </button>
    </div>
  );
}

function ErrorBanner({ onRetry }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-danger/25 bg-danger/[0.06] px-3.5 py-2.5 text-[13px] text-danger">
      Unable to load your connected accounts.
      <button type="button" onClick={onRetry} className="font-semibold hover:underline">
        Retry
      </button>
    </div>
  );
}

export function IntegrationsPage() {
  const { user } = useAuth();
  // null = still loading; {} (or populated) once the real query resolves.
  const [accountsByPlatform, setAccountsByPlatform] = useState(null);
  const [error, setError] = useState(null);
  const [modalPlatform, setModalPlatform] = useState(null);

  async function load() {
    if (!user) return;
    setError(null);
    setAccountsByPlatform(null);
    const { accounts, error: loadError } = await listConnectedAccounts(user.id);
    if (loadError) {
      setError(loadError);
      return;
    }
    const byPlatform = {};
    accounts.forEach((account) => {
      byPlatform[account.platform] = account;
    });
    setAccountsByPlatform(byPlatform);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const statuses = {};
  if (accountsByPlatform) {
    CONNECTABLE_PROVIDER_IDS.forEach((id) => {
      const row = accountsByPlatform[id];
      const connected = row?.status === "connected";
      statuses[id] = { connected, accountLabel: connected ? row.display_name || row.platform_user_id || null : null };
    });
  }

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted">
          Connect the platforms NOVA pulls data from. Connection status reflects your real account - real OAuth isn't
          available yet, so every platform starts not connected and "Connect" tells you what's coming.
        </p>
        <div className="flex shrink-0 gap-2">
          <PageLinkButton to="/analytics" label="View analytics" />
          <PageLinkButton to="/revenue" label="View revenue" />
        </div>
      </div>

      {DEMO_MODE && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-hairline bg-surface-2 px-3.5 py-2.5 text-[13px] text-muted">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          Demo mode: every number in this dashboard is mock data. Connecting a provider here does not yet pull real
          account data.
        </div>
      )}

      {error && <ErrorBanner onRetry={load} />}

      {!error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONNECTABLE_PROVIDER_IDS.map((id, i) => (
            <Reveal key={id} index={i}>
              <ProviderCard
                platform={PLATFORMS[id]}
                status={statuses[id]}
                metrics={providerMetrics(id)}
                onAction={setModalPlatform}
              />
            </Reveal>
          ))}
        </div>
      )}

      {modalPlatform && <ComingSoonModal platformName={modalPlatform} onClose={() => setModalPlatform(null)} />}
    </div>
  );
}
