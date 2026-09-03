import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../services/authService";
import { AuthLayout, AuthField, authInputClass, AuthAlert, AuthSubmitButton } from "./AuthLayout";

const MIN_PASSWORD_LENGTH = 8;

function validate({ email, password, confirmPassword }) {
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address.";
  if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (password !== confirmPassword) return "Passwords don't match.";
  return null;
}

export function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Only shown if this Supabase project has "Confirm email" enabled, in
  // which case signUp succeeds but doesn't return an active session yet -
  // otherwise AuthContext picks up the new session automatically and
  // GuestOnlyRoute redirects into onboarding on its own.
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate({ email, password, confirmPassword });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);
    // Lands on this same app's #/login route - see
    // src/auth/handleRecoveryRedirect.js for why that's not a plain redirect.
    const emailRedirectTo = `${window.location.origin}${window.location.pathname}#/login`;
    const { data, error: signUpError } = await signUp({ email, password, emailRedirectTo });
    setLoading(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }
    if (!data?.session) {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <AuthLayout title="Check your email" subtitle="One more step before your NOVA account is ready.">
        <AuthAlert tone="accent">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
        </AuthAlert>
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
      title="Create your NOVA account"
      subtitle="Run your creator business in one place."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </>
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
        <AuthField label="Password">
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
          />
        </AuthField>
        <AuthField label="Confirm password">
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={authInputClass}
          />
        </AuthField>

        <AuthSubmitButton loading={loading}>Create account</AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
