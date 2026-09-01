import { useState } from "react";
import { Link } from "react-router-dom";
import { signIn } from "../services/authService";
import { AuthLayout, AuthField, authInputClass, AuthAlert, AuthSubmitButton } from "./AuthLayout";

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // No manual navigation on success: AuthContext picks up the new session
  // via Supabase's onAuthStateChange listener, and GuestOnlyRoute (wrapping
  // this route) redirects on its own next render once `authenticated` flips.
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn({ email, password });
    setLoading(false);
    if (signInError) setError(signInError);
  }

  return (
    <AuthLayout
      title="Sign in to NOVA"
      subtitle="Access your creator workspace."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-accent hover:underline">
            Create your NOVA account
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
          />
        </AuthField>

        <div className="-mt-1 text-right">
          <Link to="/forgot-password" className="text-[13px] font-medium text-muted hover:text-accent">
            Forgot password?
          </Link>
        </div>

        <AuthSubmitButton loading={loading}>Continue</AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
