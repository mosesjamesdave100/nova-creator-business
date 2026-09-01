// Deliberately not DashboardLayout - onboarding runs before a creator has a
// dashboard to show, so it gets its own minimal chrome (wordmark + progress)
// instead of the sidebar/topbar shell.
export function OnboardingLayout({ step, totalSteps, title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <div className="border-b border-hairline px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-[720px] items-center justify-between">
          <span className="font-display text-lg font-bold tracking-[0.02em]">NOVA</span>
          <span className="text-xs text-muted">
            Step {step} of {totalSteps}
          </span>
        </div>
        <div className="mx-auto mt-4 h-1 max-w-[720px] overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 justify-center px-5 py-10 md:px-8 md:py-14">
        <div className="w-full max-w-[720px]">
          <h1 className="font-display text-2xl font-semibold md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-lg text-sm text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {footer && (
        <div className="border-t border-hairline px-5 py-5 md:px-8">
          <div className="mx-auto max-w-[720px]">{footer}</div>
        </div>
      )}
    </div>
  );
}
