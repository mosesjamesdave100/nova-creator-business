import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../services/authService";
import { AuthLayout, AuthField, authInputClass, AuthAlert, AuthSubmitButton } from "./AuthLayout";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Lands on this same app's #/reset-password route - see
    // src/auth/handleRecoveryRedirect.js for why that's not a plain redirect.
    const redirectTo = `${window.location.origin}${window.location.pathname}#/reset-password`;
    const { error: resetError } = await requestPasswordReset(email, redirectTo);
    setLoading(false);
    if (resetError) {
      setError(resetError);
      return;
    }
    // Always show the same success state regardless of whether the email is
    // registered - standard practice so this can't be used to probe which
    // emails have NOVA accounts.
    setSent(true);
  }

  if (sent) {
    return (
      <AuthLayout title="Check your email" subtitle="If an account exists for that email, we've sent a reset link.">
        <Link
          to="/login"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-hairline py-2.5 text-sm font-semibold text-text transition-colors hover:border-[#333]"
        >
          Back to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link to="/login" className="font-semibold text-accent hover:underline">
          Back to sign in
        </Link>
      }
    >
      {error && <AuthAlert>{error}</AuthAlert>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField label="Email">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
          />
        </AuthField>
        <AuthSubmitButton loading={loading}>Send reset link</AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
