export function StepWelcome() {
  return (
    <div className="flex flex-col items-start rounded-xl border border-hairline bg-surface p-8 md:p-12">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-bold text-bg"
        style={{ background: "linear-gradient(135deg, #c7ff3d, #8570db)" }}
      >
        N
      </div>
      <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted md:text-base">
        Content, audience, sponsorships and revenue currently live across six different platforms. NOVA brings them
        into one workspace, five quick questions and your dashboard is ready.
      </p>
    </div>
  );
}
