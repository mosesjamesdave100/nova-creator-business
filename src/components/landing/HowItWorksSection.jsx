import { SectionHeading } from "./SectionHeading";

const STEPS = [
  { number: "01", title: "CONNECT", copy: "Connect your creator platforms." },
  { number: "02", title: "UNDERSTAND", copy: "Bring your content, audience and revenue data together." },
  { number: "03", title: "GROW", copy: "Use your data to make better content and monetization decisions." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12 md:pb-28">
      <SectionHeading eyebrow="07 / HOW IT WORKS" heading="HOW NOVA WORKS." align="center" />

      <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
        {STEPS.map((step) => (
          <div key={step.number} className="text-center md:text-left">
            <div className="font-display text-sm text-accent">{step.number}</div>
            <div className="mt-3 font-display text-xl font-semibold tracking-[0.02em]">{step.title}</div>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{step.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
