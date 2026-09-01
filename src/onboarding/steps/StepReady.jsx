import { useEffect, useState } from "react";
import { Icon } from "../../dashboard/Icon";
import { CREATOR_GOALS } from "../../data/onboarding";

const GENERATE_STEPS = [
  "Setting up your creator profile",
  "Saving your goals",
  "Personalizing your dashboard",
];

function GeneratingList() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= GENERATE_STEPS.length) return;
    const timer = setTimeout(() => setVisibleCount((v) => v + 1), 450);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div className="flex flex-col gap-3">
      {GENERATE_STEPS.map((label, i) => {
        const done = i < visibleCount;
        const active = i === visibleCount;
        return (
          <div key={label} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                done ? "border-accent bg-accent text-bg" : "border-[#333] text-transparent"
              }`}
            >
              {done ? <Icon name="check" size={12} /> : active ? (
                <span className="h-2 w-2 animate-pulse rounded-full bg-muted" />
              ) : null}
            </span>
            <span className={done ? "text-text" : active ? "text-text" : "text-faint"}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function StepReady({ profile, goals, onFinish }) {
  const [ready, setReady] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState(null);
  const goalLabels = goals.map((id) => CREATOR_GOALS.find((g) => g.id === id)?.label).join(", ");

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  async function handleFinish() {
    setFinishing(true);
    setError(null);
    const result = await onFinish();
    if (result?.error) {
      setError(result.error);
      setFinishing(false);
    }
    // On success, the parent navigates away - no need to reset local state.
  }

  if (!ready) {
    return (
      <div className="rounded-xl border border-hairline bg-surface p-6 md:p-8">
        <GeneratingList />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-hairline bg-surface p-6 md:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Icon name="check" size={16} />
          </span>
          <div>
            <div className="text-sm font-semibold text-text">You&rsquo;re ready to go.</div>
            <div className="text-[13px] text-muted">
              NOVA will bring your creator business into one place and help you understand what to do next.
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col divide-y divide-hairline border-t border-hairline">
          <div className="flex items-center justify-between py-3.5 text-sm">
            <span className="text-muted">Creator name</span>
            <span className="font-medium text-text">{profile.displayName || "Not set"}</span>
          </div>
          <div className="flex items-center justify-between py-3.5 text-sm">
            <span className="text-muted">Category</span>
            <span className="font-medium text-text">{profile.category}</span>
          </div>
          <div className="flex items-center justify-between py-3.5 text-sm">
            <span className="text-muted">Focused on</span>
            <span className="font-medium text-text">{goalLabels || "Not set"}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-danger/25 bg-danger/[0.06] px-3.5 py-2.5 text-[13px] text-danger">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleFinish}
        disabled={finishing}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {finishing ? "Setting up your workspace…" : "Go to Dashboard"}
        {!finishing && <Icon name="arrowRight" size={15} />}
      </button>
    </div>
  );
}
