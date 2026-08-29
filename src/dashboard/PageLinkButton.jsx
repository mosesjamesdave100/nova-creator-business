import { Link } from "react-router-dom";

// Small cross-page navigation CTA, reused in every page's intro row so the
// product feels connected (Analytics->Insights, Revenue->Brand Deals, etc.)
// instead of a set of isolated pages. Same visual language as the per-insight
// action buttons on the Insights page.
export function PageLinkButton({ to, label }) {
  return (
    <Link
      to={to}
      className="flex shrink-0 items-center gap-1 rounded border border-accent/40 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-accent transition-colors hover:bg-accent hover:text-bg"
    >
      {label} &rarr;
    </Link>
  );
}
