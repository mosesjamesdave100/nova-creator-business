import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

// Route guard covering all three states Phase 2A requires:
//   unauthenticated              -> /login (remembers where they were headed)
//   authenticated, onboarding incomplete -> /onboarding
//   authenticated, onboarding complete   -> through to the app
//
// `requireOnboarding={false}` is for the onboarding route itself: it only
// needs auth, and actively bounces an already-onboarded creator back to the
// dashboard instead of letting them re-run the wizard from a stale link.
export function ProtectedRoute({ requireOnboarding = true }) {
  const { loading, authenticated, onboardingCompleted } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoadingScreen />;

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireOnboarding && !onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requireOnboarding && onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
