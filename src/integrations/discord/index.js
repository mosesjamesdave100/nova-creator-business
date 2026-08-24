// MOCK adapter. Swap the bodies below for a real Discord API / bot
// integration (guild member counts, presence, message activity) - callers
// already `await` these, so no call site changes when that happens.
import { mockDelay } from "../shared";
import { PLATFORMS } from "../../data/platforms";
import { discordServer } from "../../data/community";
import { CONNECTIONS, CONNECTION_STATE } from "../../data/connections";

const meta = PLATFORMS.discord;

export async function getConnectionStatus() {
  await mockDelay();
  const conn = CONNECTIONS.discord;
  return { ...meta, ...conn, connected: conn.state === CONNECTION_STATE.CONNECTED };
}

export async function getServerStats() {
  await mockDelay();
  return discordServer;
}
