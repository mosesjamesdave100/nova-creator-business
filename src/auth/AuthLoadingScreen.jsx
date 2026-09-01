// Shown while AuthContext is still resolving the initial session/profile -
// avoids a blank flash before redirect decisions can be made.
export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg text-text">
      <span className="font-display text-lg font-bold tracking-[0.02em]">NOVA</span>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" style={{ animationDelay: "150ms" }} />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
