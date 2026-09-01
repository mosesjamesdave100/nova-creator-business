import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { useAuth } from "../context/AuthContext";
import { hasAnyConnectedAccount } from "../services/connectedAccountsService";

// Demo-data isolation (Phase 2A): everything below this banner is still the
// existing demo dashboard - real per-creator analytics/audience/revenue
// don't exist until a real platform integration ships (Phase 2B+). This
// makes sure a brand-new creator, who has connected nothing yet, is told
// that plainly instead of being left to assume the sample numbers below are
// their own. Disappears once connectedAccountsService reports a real
// connection.
export function ConnectPlatformsBanner() {
  const { user } = useAuth();
  const [connected, setConnected] = useState(true); // assume connected until checked, avoids a flash

  useEffect(() => {
    let active = true;
    if (user) {
      hasAnyConnectedAccount(user.id).then(({ connected: hasConnection }) => {
        if (active) setConnected(hasConnection);
      });
    }
    return () => {
      active = false;
    };
  }, [user]);

  if (connected) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/25 bg-accent/[0.06] p-5 md:p-6">
      <div>
        <h3 className="font-display text-base font-semibold text-text">Your creator business starts here.</h3>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Connect your platforms to bring your real analytics, audience and revenue into NOVA. Everything below is
          sample data until then.
        </p>
      </div>
      <Link
        to="/integrations"
        className="flex shrink-0 items-center gap-1.5 rounded bg-accent px-4 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
      >
        <Icon name="integrations" size={14} />
        Connect Platforms
      </Link>
    </div>
  );
}
