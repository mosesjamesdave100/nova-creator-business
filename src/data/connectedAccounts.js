// Settings' "Connected Accounts" list - the same connection state and
// platform metadata the Integrations page reads, re-presented in the
// simpler connected/not-connected shape a settings screen needs.
import { CONNECTABLE_PROVIDER_IDS, PLATFORMS } from "./platforms";
import { CONNECTIONS, CONNECTION_STATE } from "./connections";

export const connectedAccounts = CONNECTABLE_PROVIDER_IDS.map((id) => ({
  id,
  name: PLATFORMS[id].name,
  brandColor: PLATFORMS[id].brandColor,
  connected: CONNECTIONS[id].state !== CONNECTION_STATE.NOT_CONNECTED,
  accountLabel: CONNECTIONS[id].accountLabel,
}));
