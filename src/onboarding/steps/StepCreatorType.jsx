import { OptionCard } from "../OptionCard";
import { CREATOR_TYPES } from "../../data/onboarding";

export function StepCreatorType({ value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {CREATOR_TYPES.map((type) => (
        <OptionCard
          key={type.id}
          option={type}
          selected={value === type.id}
          onClick={() => onChange(type.id)}
        />
      ))}
    </div>
  );
}
