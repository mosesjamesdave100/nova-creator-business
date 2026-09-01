// Shared chrome for every auth screen (sign in/up, forgot/reset password) -
// deliberately its own minimal layout rather than DashboardLayout's
// sidebar/topbar shell, same reasoning as OnboardingLayout: there's no
// dashboard to show chrome for yet. Reuses NOVA's existing card/typography/
// button language (dark surface card, accent CTA) rather than introducing a
// new visual system.
export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5 py-10 text-text">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <span className="font-display text-xl font-bold tracking-[0.02em]">NOVA</span>
          <p className="mt-2 text-sm text-muted">Run your creator business in one place.</p>
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-6 md:p-8">
          <h1 className="font-display text-lg font-semibold">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </div>
    </div>
  );
}

export function AuthField({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export const authInputClass =
  "rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none";

export function AuthAlert({ tone = "danger", children }) {
  const toneClass =
    tone === "danger" ? "border-danger/25 bg-danger/[0.06] text-danger" : "border-accent/25 bg-accent/[0.06] text-accent";
  return <div className={`mb-5 rounded-md border px-3.5 py-2.5 text-[13px] ${toneClass}`}>{children}</div>;
}

export function AuthSubmitButton({ children, loading, ...props }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-2.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
