import { CREATOR_CATEGORIES, TIMEZONES, CURRENCIES } from "../../data/onboarding";

const inputClass =
  "rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none";

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export function StepProfile({ value, onChange }) {
  function set(field, val) {
    onChange({ ...value, [field]: val });
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="Creator name">
        <input
          value={value.displayName}
          onChange={(e) => set("displayName", e.target.value)}
          placeholder="How brands and fans see your name"
          className={inputClass}
        />
      </Field>
      <Field label="Username">
        <input
          value={value.username}
          onChange={(e) => set("username", e.target.value)}
          placeholder="yourusername"
          className={inputClass}
        />
      </Field>
      <Field label="Creator category">
        <select value={value.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
          {CREATOR_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Website">
        <input
          value={value.website}
          onChange={(e) => set("website", e.target.value)}
          placeholder="Optional"
          className={inputClass}
        />
      </Field>
      <Field label="Timezone">
        <select value={value.timezone} onChange={(e) => set("timezone", e.target.value)} className={inputClass}>
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Default currency">
        <select value={value.currency} onChange={(e) => set("currency", e.target.value)} className={inputClass}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field label="Bio">
          <textarea
            rows={3}
            value={value.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder="Optional - a couple sentences about what you create"
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>
    </div>
  );
}
