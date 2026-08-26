import { useEffect, useState } from "react";
import { Icon } from "../../dashboard/Icon";
import { CREATE_TYPES, GROWTH_FOCUS } from "../../data/onboarding";
import { PLATFORMS } from "../../data/platforms";

const GENERATE_STEPS = [
  "Setting up your creator profile",
  "Linking your connected platforms",
  "Personalizing your dashboard",
];

function GeneratingList() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= GENERATE_STEPS.length) return;
    const timer = setTimeout(() => setVisibleCount((v) => v + 1), 500);
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

export function StepReady({ createType, connected, growthFocus, onFinish }) {
  const [ready, setReady] = useState(false);
  const typeLabel = CREATE_TYPES.find((t) => t.id === createType)?.label;
  const focusLabels = growthFocus.map((id) => GROWTH_FOCUS.find((g) => g.id === id)?.label).join(", ");

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1700);
    return () => clearTimeout(timer);
  }, []);

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
            <div className="text-sm font-semibold text-text">Your NOVA workspace is ready.</div>
            <div className="text-[13px] text-muted">Built from what you told us, edit any of this later in Settings.</div>
          </div>
        </div>

        <div className="mt-6 flex flex-col divide-y divide-hairline border-t border-hairline">
          <div className="flex items-center justify-between py-3.5 text-sm">
            <span className="text-muted">You create</span>
            <span className="font-medium text-text">{typeLabel}</span>
          </div>
          <div className="flex items-center justify-between py-3.5 text-sm">
            <span className="text-muted">Connected</span>
            <span className="font-medium text-text">
              {connected.length > 0 ? connected.map((id) => PLATFORMS[id].name).join(", ") : "None yet"}
            </span>
          </div>
          <div className="flex items-center justify-between py-3.5 text-sm">
            <span className="text-muted">Growing</span>
            <span className="font-medium text-text">{focusLabels}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.01]"
      >
        ENTER NOVA
        <Icon name="arrowRight" size={15} />
      </button>
    </div>
  );
}
