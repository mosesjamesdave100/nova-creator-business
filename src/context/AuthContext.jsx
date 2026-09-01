import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCurrentSession, onAuthStateChange, signOut as signOutService } from "../services/authService";
import { ensureProfile } from "../services/profileService";

// Single source of truth for "who's signed in and where are they in
// onboarding" - every page reads this instead of re-deriving auth state or
// re-querying Supabase itself. Mirrors the same "centralize the data layer,
// don't scatter calls through UI components" convention already used for
// demo data (src/data/*.js) and integrations (src/integrations/*).
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (sessionUser) => {
    if (!sessionUser) {
      setProfile(null);
      return;
    }
    const { profile: loaded } = await ensureProfile(sessionUser);
    setProfile(loaded);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await loadProfile(user);
  }, [user, loadProfile]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const { session } = await getCurrentSession();
      if (!active) return;
      setUser(session?.user ?? null);
      await loadProfile(session?.user ?? null);
      if (active) setLoading(false);
    }
    bootstrap();

    // Keeps this state correct across sign-in, sign-out, token refresh and
    // the magic-link redirect Supabase performs after a password reset -
    // all of those fire this listener rather than needing separate handling.
    const subscription = onAuthStateChange(async (session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      await loadProfile(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signOut() {
    await signOutService();
    setUser(null);
    setProfile(null);
  }

  const value = {
    user,
    profile,
    loading,
    authenticated: Boolean(user),
    onboardingCompleted: Boolean(profile?.onboarding_completed),
    refreshProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
