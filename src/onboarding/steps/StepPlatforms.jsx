import { OptionCard } from "../OptionCard";
import { PLATFORMS, CONNECTABLE_PROVIDER_IDS } from "../../data/platforms";

export function StepPlatforms({ value, onToggle }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {CONNECTABLE_PROVIDER_IDS.map((id) => {
        const platform = PLATFORMS[id];
        return (
          <OptionCard
            key={id}
            option={{ label: platform.name }}
            selected={value.includes(id)}
            onClick={() => onToggle(id)}
            brandColor={platform.brandColor}
          />
        );
      })}
    </div>
  );
}
