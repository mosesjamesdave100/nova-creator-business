import { OptionCard } from "../OptionCard";
import { GROWTH_FOCUS } from "../../data/onboarding";

export function StepGrowthFocus({ value, onToggle }) {
  return (
    <div className="flex flex-col gap-3">
      {GROWTH_FOCUS.map((goal) => (
        <OptionCard key={goal.id} option={goal} selected={value.includes(goal.id)} onClick={() => onToggle(goal.id)} />
      ))}
    </div>
  );
}
