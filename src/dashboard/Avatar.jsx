// Shared creator avatar. No real photo exists yet (fictional creator), so
// this is a monogram on a soft accent gradient rather than a flat gray
// circle, used anywhere the account shows up (sidebar, top bar menu).
export function Avatar({ size = 32, initial = "N" }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-bg"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: "linear-gradient(135deg, #c7ff3d, #8570db)",
      }}
    >
      {initial}
    </div>
  );
}
