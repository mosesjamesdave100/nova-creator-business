import { Link } from "react-router-dom";
import { SectionHeading } from "./SectionHeading";
import { DashboardPreview } from "./DashboardPreview";

export function CommandCenterSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28">
      <SectionHeading
        eyebrow="02 / THE PRODUCT"
        heading={
          <>
            YOUR CREATOR BUSINESS.
            <br />
            ONE VIEW.
          </>
        }
        copy="Content, audience, community and revenue, connected in one place."
      >
        <Link
          to="/dashboard"
          className="mt-7 inline-block rounded bg-accent px-6 py-[15px] text-sm font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          OPEN CREATOR DASHBOARD →
        </Link>
      </SectionHeading>

      <div className="mt-12 md:mt-16">
        <DashboardPreview />
      </div>
    </section>
  );
}
