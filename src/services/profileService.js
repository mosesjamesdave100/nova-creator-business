// All reads/writes to the `profiles` table go through here - UI components
// never query Supabase directly. A profile row is normally created
// automatically by the on_auth_user_created trigger (see
// supabase/schema.sql) the moment someone signs up, so the client almost
// never needs to insert one itself; ensureProfile below exists only as a
// defensive fallback if that row is somehow missing (e.g. the trigger
// hasn't been run yet in a given Supabase project).
import { supabase } from "../lib/supabaseClient";

const FRIENDLY_ERROR = "We couldn't reach NOVA's servers. Please try again.";

export async function getProfile(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  if (error) return { profile: null, error: FRIENDLY_ERROR };
  return { profile: data, error: null };
}

// Only used as a fallback - see the module comment above.
export async function ensureProfile(user) {
  const { profile: existing } = await getProfile(user.id);
  if (existing) return { profile: existing, error: null };

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      email: user.email,
      display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || null,
    })
    .select()
    .single();
  if (error) return { profile: null, error: FRIENDLY_ERROR };
  return { profile: data, error: null };
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) {
    if (error.code === "23505") return { profile: null, error: "That username is already taken." };
    return { profile: null, error: FRIENDLY_ERROR };
  }
  return { profile: data, error: null };
}

// Onboarding's final step - one call that saves everything collected across
// the wizard's steps and flips onboarding_completed, rather than the wizard
// writing to the database after every step.
export async function completeOnboarding(userId, onboardingData) {
  return updateProfile(userId, { ...onboardingData, onboarding_completed: true });
}
