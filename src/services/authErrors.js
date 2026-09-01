// Translates Supabase's raw auth error messages into the human-friendly
// copy this product's UI actually shows - callers never surface
// error.message directly. Matched by substring since supabase-js doesn't
// give stable error codes for every case across versions.
const PATTERNS = [
  [/invalid login credentials/i, "Email or password is incorrect. Please try again."],
  [/email not confirmed/i, "Please confirm your email before signing in - check your inbox for the confirmation link."],
  [/user already registered/i, "An account with this email already exists. Try signing in instead."],
  [/password should be at least/i, "Password must be at least 6 characters."],
  [/unable to validate email address/i, "That doesn't look like a valid email address."],
  [/rate limit/i, "Too many attempts. Please wait a moment and try again."],
  [/failed to fetch|networkerror|load failed/i, "We couldn't reach NOVA's servers. Check your connection and try again."],
  [/token has expired or is invalid/i, "That link has expired. Request a new one and try again."],
];

export function mapAuthError(error) {
  if (!error) return null;
  const message = typeof error === "string" ? error : error.message || "";
  for (const [pattern, friendly] of PATTERNS) {
    if (pattern.test(message)) return friendly;
  }
  return "Something went wrong. Please try again.";
}
