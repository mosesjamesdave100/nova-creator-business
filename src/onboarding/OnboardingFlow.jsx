import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "./OnboardingLayout";
import { StepProfile } from "./steps/StepProfile";
import { StepGoals } from "./steps/StepGoals";
import { StepConnect } from "./steps/StepConnect";
import { StepReady } from "./steps/StepReady";
import { Icon } from "../dashboard/Icon";
import { useAuth } from "../context/AuthContext";
import { completeOnboarding } from "../services/profileService";
import { CREATOR_CATEGORIES, TIMEZONES, CURRENCIES } from "../data/onboarding";

const TOTAL_STEPS = 4;

const STEP_COPY = [
  { title: "Let's set up your creator profile.", subtitle: "This is what NOVA and your future brand partners will see." },
  { title: "What are you focused on?", subtitle: "Pick what matters most right now, this shapes what NOVA highlights first." },
  { title: "Connect your platforms", subtitle: "Link the accounts you want NOVA to pull data from. You can add more later." },
  { title: "You're ready to go.", subtitle: "Almost there." },
];

function toggleInList(list, id) {
  return list.includes(id) ? list.filter((v) => v !== id) : [...list, id];
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [profileForm, setProfileForm] = useState({
    displayName: profile?.display_name ?? user?.user_metadata?.display_name ?? "",
    username: profile?.username ?? "",
    category: profile?.category ?? CREATOR_CATEGORIES[0],
    bio: profile?.bio ?? "",
    website: profile?.website ?? "",
    timezone: profile?.timezone ?? TIMEZONES[0],
    currency: profile?.currency ?? CURRENCIES[0],
  });
  const [goals, setGoals] = useState(profile?.goals ?? []);

  const canContinue = step === 1 ? profileForm.displayName.trim().length > 0 : step === 2 ? goals.length > 0 : true;

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  function goNext() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  async function handleFinish() {
    const { error } = await completeOnboarding(user.id, {
      display_name: profileForm.displayName.trim(),
      username: profileForm.username.trim() || null,
      category: profileForm.category,
      bio: profileForm.bio.trim(),
      website: profileForm.website.trim(),
      timezone: profileForm.timezone,
      currency: profileForm.currency,
      goals,
    });
    if (error) return { error };

    await refreshProfile();
    navigate("/dashboard", { replace: true });
    return { error: null };
  }

  const { title, subtitle } = STEP_COPY[step - 1];

  const footer =
    step < TOTAL_STEPS ? (
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
          Continue
          <Icon name="arrowRight" size={15} />
        </button>
      </div>
    ) : null;

  return (
    <OnboardingLayout step={step} totalSteps={TOTAL_STEPS} title={title} subtitle={subtitle} footer={footer}>
      {step === 1 && <StepProfile value={profileForm} onChange={setProfileForm} />}
      {step === 2 && <StepGoals value={goals} onToggle={(id) => setGoals((v) => toggleInList(v, id))} />}
      {step === 3 && <StepConnect />}
      {step === 4 && <StepReady profile={profileForm} goals={goals} onFinish={handleFinish} />}
    </OnboardingLayout>
  );
}
