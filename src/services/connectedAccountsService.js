// Foundation for real platform connections (Phase 2B wires actual OAuth into
// this). For now nothing ever writes a "connected" row - there's no OAuth
// flow yet - so this only ever reads back an empty list or rows a future
// phase inserted, letting the UI ask "does this user have anything
// connected?" against the real database instead of a hardcoded assumption.
import { supabase } from "../lib/supabaseClient";

export async function listConnectedAccounts(userId) {
  const { data, error } = await supabase.from("connected_accounts").select("*").eq("user_id", userId);
  if (error) return { accounts: [], error: "We couldn't reach NOVA's servers. Please try again." };
  return { accounts: data ?? [], error: null };
}

export async function hasAnyConnectedAccount(userId) {
  const { accounts, error } = await listConnectedAccounts(userId);
  if (error) return { connected: false, error };
  return { connected: accounts.some((a) => a.status === "connected"), error: null };
}
