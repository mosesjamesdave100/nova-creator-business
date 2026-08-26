import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "./OnboardingLayout";
import { StepWelcome } from "./steps/StepWelcome";
import { StepCreateType } from "./steps/StepCreateType";
import { StepConnect } from "./steps/StepConnect";
import { StepGrowthFocus } from "./steps/StepGrowthFocus";
import { StepReady } from "./steps/StepReady";
import { Icon } from "../dashboard/Icon";

const STEP_COPY = [
  { title: "Welcome to NOVA", subtitle: "Bring your creator business into one place." },
  { title: "What do you create?", subtitle: "This helps NOVA tailor the dashboard and insights to your content." },
  { title: "Connect your platforms", subtitle: "Link the accounts you want NOVA to pull data from. You can add more later." },
  { title: "What are you trying to grow?", subtitle: "Pick what matters most right now, this shapes what NOVA highlights first." },
  { title: "Your NOVA workspace is ready.", subtitle: "Almost there." },
];

function toggleInList(list, id) {
  return list.includes(id) ? list.filter((v) => v !== id) : [...list, id];
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [createType, setCreateType] = useState(null);
  const [connected, setConnected] = useState([]);
  const [growthFocus, setGrowthFocus] = useState([]);

  const canContinue =
    step === 1 ||
    (step === 2 && createType !== null) ||
    step === 3 ||
    (step === 4 && growthFocus.length > 0);

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  function goNext() {
    setStep((s) => Math.min(5, s + 1));
  }

  const { title, subtitle } = STEP_COPY[step - 1];

  const footer =
    step < 5 ? (
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            step === 1 ? "invisible" : "text-muted hover:text-text"
          }`}
        >
          <Icon name="arrowLeft" size={15} />
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!canContinue}
          className={`flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-semibold transition-transform ${
            canContinue ? "bg-accent text-bg hover:scale-[1.02]" : "cursor-not-allowed bg-surface-2 text-faint"
          }`}
        >
          {step === 1 ? "Get started" : "Continue"}
          <Icon name="arrowRight" size={15} />
        </button>
      </div>
    ) : null;

  return (
    <OnboardingLayout step={step} title={title} subtitle={subtitle} footer={footer}>
      {step === 1 && <StepWelcome />}
      {step === 2 && <StepCreateType value={createType} onChange={setCreateType} />}
      {step === 3 && <StepConnect connected={connected} onToggle={(id) => setConnected((v) => toggleInList(v, id))} />}
      {step === 4 && (
        <StepGrowthFocus value={growthFocus} onToggle={(id) => setGrowthFocus((v) => toggleInList(v, id))} />
      )}
      {step === 5 && (
        <StepReady
          createType={createType}
          connected={connected}
          growthFocus={growthFocus}
          onFinish={() => navigate("/dashboard")}
        />
      )}
    </OnboardingLayout>
  );
}
