// Stand-in for real photography. NOVA is a fictional creator, so there is no
// real asset yet: this keeps the crop, ratio and grain treatment real so a
// photo can be dropped in later without touching layout.
export function PlaceholderImage({ label, note, ratio, className = "" }) {
  return (
    <div
      className={`grain relative flex h-full w-full flex-col items-center justify-center gap-2 border border-white/[0.07] bg-[radial-gradient(circle_at_32%_22%,_#242424,_#0a0a0a_72%)] px-8 text-center ${className}`}
    >
      {ratio && (
        <span className="absolute bottom-4 right-4 font-display text-[10px] tracking-[0.08em] text-[#4a4a4a]">
          {ratio}
        </span>
      )}
      <span className="font-display text-[13px] tracking-[0.02em] text-[#6b6b6b]">{label}</span>
      {note && <span className="max-w-[240px] text-[11px] leading-relaxed text-faint">{note}</span>}
    </div>
  );
}
