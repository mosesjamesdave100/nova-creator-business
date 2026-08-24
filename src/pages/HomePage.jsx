import { Hero } from "../components/Hero";
import { WhatsHappeningNow } from "../components/WhatsHappeningNow";
import { CommandCenterSection } from "../components/landing/CommandCenterSection";
import { FlowSection } from "../components/landing/FlowSection";
import { RevenueHubSection } from "../components/landing/RevenueHubSection";
import { SponsorshipSection } from "../components/landing/SponsorshipSection";
import { IntegrationsSection } from "../components/landing/IntegrationsSection";
import { InsightsSection } from "../components/landing/InsightsSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { FinalCTASection } from "../components/landing/FinalCTASection";

export function HomePage() {
  return (
    <>
      <Hero />
      <WhatsHappeningNow />
      <FlowSection />
      <CommandCenterSection />
      <RevenueHubSection />
      <SponsorshipSection />
      <IntegrationsSection />
      <InsightsSection />
      <HowItWorksSection />
      <FinalCTASection />
    </>
  );
}
