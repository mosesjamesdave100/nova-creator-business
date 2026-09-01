import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updatePassword } from "../services/authService";
import { AuthLayout, AuthField, authInputClass, AuthAlert, AuthSubmitButton } from "./AuthLayout";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

const MIN_PASSWORD_LENGTH = 8;

export function ResetPasswordPage() {
  const { loading: authLoading, authenticated, onboardingCompleted } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (authLoading) return <AuthLoadingScreen />;

  // handleRecoveryRedirect (run at app startup) establishes a session from
  // the emailed link's tokens before this page ever renders - no session
  // here means the link was invalid, expired, or already used.
  if (!authenticated) {
    return (
      <AuthLayout title="This link has expired" subtitle="Password reset links are only valid for a limited time.">
        <Link
          to="/forgot-password"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.01]"
        >
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  if (done) {
    return <Navigate to={onboardingCompleted ? "/dashboard" : "/onboarding"} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError(null);
    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    setLoading(false);
    if (updateError) {
      setError(updateError);
      return;
    }
    setDone(true);
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a new password for your NOVA account.">
      {error && <AuthAlert>{error}</AuthAlert>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField label="New password">
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
          />
        </AuthField>
        <AuthField label="Confirm new password">
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={authInputClass}
          />
        </AuthField>
        <AuthSubmitButton loading={loading}>Update password</AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
