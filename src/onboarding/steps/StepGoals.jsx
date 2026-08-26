import { OptionCard } from "../OptionCard";
import { CREATOR_GOALS } from "../../data/onboarding";

export function StepGoals({ value, onToggle }) {
  return (
    <div className="flex flex-col gap-3">
      {CREATOR_GOALS.map((goal) => (
        <OptionCard key={goal.id} option={goal} selected={value.includes(goal.id)} onClick={() => onToggle(goal.id)} />
      ))}
    </div>
  );
}
