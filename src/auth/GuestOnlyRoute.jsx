import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

// Sign in / Sign up shouldn't be reachable by someone already signed in -
// sends them wherever they actually belong instead.
export function GuestOnlyRoute() {
  const { loading, authenticated, onboardingCompleted } = useAuth();

  if (loading) return <AuthLoadingScreen />;
  if (authenticated) return <Navigate to={onboardingCompleted ? "/dashboard" : "/onboarding"} replace />;

  return <Outlet />;
}
