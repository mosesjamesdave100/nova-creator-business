import { OptionCard } from "../OptionCard";
import { CREATE_TYPES } from "../../data/onboarding";

export function StepCreateType({ value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {CREATE_TYPES.map((type) => (
        <OptionCard key={type.id} option={type} selected={value === type.id} onClick={() => onChange(type.id)} />
      ))}
    </div>
  );
}
