import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { GuestOnlyRoute } from "./auth/GuestOnlyRoute";
import { SignInPage } from "./auth/SignInPage";
import { SignUpPage } from "./auth/SignUpPage";
import { ForgotPasswordPage } from "./auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./auth/ResetPasswordPage";
import { HomePage } from "./pages/HomePage";
import { CreatorProfilePage } from "./pages/CreatorProfilePage";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { OverviewPage } from "./dashboard/OverviewPage";
import { ContentAnalyticsPage } from "./dashboard/ContentAnalyticsPage";
import { AudiencePage } from "./dashboard/AudiencePage";
import { RevenuePage } from "./dashboard/RevenuePage";
import { SponsorshipsPage } from "./dashboard/SponsorshipsPage";
import { ShopPage } from "./dashboard/ShopPage";
import { AIInsightsPage } from "./dashboard/AIInsightsPage";
import { IntegrationsPage } from "./dashboard/IntegrationsPage";
import { MediaKitPage } from "./dashboard/MediaKitPage";
import { ContentPlannerPage } from "./dashboard/ContentPlannerPage";
import { CommunityPage } from "./dashboard/CommunityPage";
import { SettingsPage } from "./dashboard/SettingsPage";
import { ComingSoon } from "./dashboard/ComingSoon";
import { OnboardingFlow } from "./onboarding/OnboardingFlow";
import { NAV_ITEMS } from "./dashboard/navigation";

// Maps each nav item's id to its built page component. Anything missing
// falls back to the ComingSoon placeholder so the nav never dead-ends.
const BUILT_ROUTES = {
  overview: OverviewPage,
  analytics: ContentAnalyticsPage,
  audience: AudiencePage,
  revenue: RevenuePage,
  sponsorships: SponsorshipsPage,
  shop: ShopPage,
  insights: AIInsightsPage,
  "media-kit": MediaKitPage,
  integrations: IntegrationsPage,
  "content-planner": ContentPlannerPage,
  community: CommunityPage,
  settings: SettingsPage,
};

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <main className="min-h-screen bg-bg font-sans text-text">
                <HomePage />
              </main>
            }
          />
          <Route
            path="/creator/:username"
            element={
              <main className="min-h-screen bg-bg font-sans text-text">
                <CreatorProfilePage />
              </main>
            }
          />

          {/* Signed-in visitors get bounced away from these - see
              GuestOnlyRoute. Reset password is its own case: the emailed
              link signs the browser into a temporary recovery session, so it
              can't sit behind GuestOnlyRoute (that would redirect away
              before the user can set a new password) or ProtectedRoute
              (onboarding may not be done yet). */}
          <Route element={<GuestOnlyRoute />}>
            <Route path="/login" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route element={<ProtectedRoute requireOnboarding={false} />}>
            <Route path="/onboarding" element={<OnboardingFlow />} />
          </Route>

          {/* Pathless layout route: every dashboard page is a flat, top-level
              URL (per the product's route architecture) that shares the same
              sidebar/topbar shell, rather than nesting under /dashboard/*. */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {NAV_ITEMS.map((item) => {
                const Page = BUILT_ROUTES[item.id];
                return (
                  <Route
                    key={item.id}
                    path={item.path.slice(1)}
                    element={Page ? <Page /> : <ComingSoon title={item.label} />}
                  />
                );
              })}
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
