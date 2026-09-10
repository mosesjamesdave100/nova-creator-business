// Cross-origin support for browser-initiated calls to youtube-oauth-start (a
// fetch() from GitHub Pages to this project's supabase.co functions domain
// is a different origin). Scoped to NOVA's known origins rather than a
// wildcard - youtube-oauth-start requires an Authorization header, and a
// wildcard Access-Control-Allow-Origin can't safely be combined with that.
const ALLOWED_ORIGINS = new Set([
  "https://mosesjamesdave100.github.io",
  "http://localhost:3000",
]);

export function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("Origin") ?? "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    Vary: "Origin",
  };
}

export function handlePreflight(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  return null;
}
