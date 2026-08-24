import { Link } from "react-router-dom";
import { SectionHeading } from "./SectionHeading";
import { PLATFORMS, CONNECTABLE_PROVIDER_IDS } from "../../data/platforms";

export function IntegrationsSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28">
      <SectionHeading
        eyebrow="05 / INTEGRATIONS"
        heading="CONNECT YOUR WORLD."
        copy="Connect your platforms once. See your creator business in one place."
        align="center"
      />

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-16 md:grid-cols-7 md:gap-3">
        {CONNECTABLE_PROVIDER_IDS.map((id) => {
          const provider = PLATFORMS[id];
          return (
            <div
              key={id}
              className="flex flex-col items-center gap-2.5 rounded-xl border border-hairline bg-surface px-4 py-6 text-center"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold"
                style={{ background: `${provider.brandColor}22`, color: provider.brandColor }}
              >
                {provider.name.charAt(0)}
              </div>
              <div className="text-[13px] text-text">{provider.name}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <p className="text-xs text-faint">
          Demo integrations for this prototype, not live connections yet.
        </p>
        <Link
          to="/integrations"
          className="rounded bg-accent px-6 py-[15px] text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          CONNECT ACCOUNTS →
        </Link>
      </div>
    </section>
  );
}
