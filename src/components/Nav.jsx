import { useState } from "react";
import { Link } from "react-router-dom";
import { LiveDot } from "./LiveDot";
import { creatorProfile } from "../data/creatorProfile";

const PROFILE_PATH = `/creator/${creatorProfile.username}`;

// Each link either scrolls within this page (the homepage) or navigates to a
// real page, optionally telling that page which section to land on (via
// router state, not a second URL hash, since HashRouter already owns the
// address bar's one hash).
const LINKS = [
  { label: "CONTENT", kind: "scroll", target: "whats-happening" },
  { label: "SHOP", kind: "route", to: PROFILE_PATH, scrollTo: "shop" },
  { label: "COMMUNITY", kind: "route", to: "/community" },
  { label: "WORK WITH ME", kind: "route", to: PROFILE_PATH, scrollTo: "partner" },
];

function NavLink({ link, onNavigate, className }) {
  if (link.kind === "scroll") {
    return (
      <a
        href={`#${link.target}`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(link.target)?.scrollIntoView({ behavior: "smooth" });
          onNavigate?.();
        }}
        className={className}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link
      to={link.to}
      state={link.scrollTo ? { scrollTo: link.scrollTo } : undefined}
      onClick={() => onNavigate?.()}
      className={className}
    >
      {link.label}
    </Link>
  );
}

export function Nav({ reveal }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative border-b border-hairline transition-[opacity,transform] duration-500 ${
        reveal ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-5 md:px-10">
        <div className="font-display text-lg font-bold tracking-[0.02em]">NOVA</div>

        <ul className="hidden gap-9 text-[13px] text-muted md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <NavLink link={link} className="transition-colors hover:text-text" />
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          <div className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.06em]">
            <LiveDot />
            LIVE
          </div>
          <Link
            to="/dashboard"
            className="rounded border border-[#333] px-4 py-2 text-[12px] font-semibold tracking-[0.04em] text-text transition-colors hover:border-accent hover:text-accent"
          >
            OPEN NOVA →
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="text-[12px] font-semibold tracking-[0.06em] text-muted md:hidden"
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-hairline px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-5 text-sm text-muted">
            {LINKS.map((link) => (
              <li key={link.label}>
                <NavLink link={link} onNavigate={() => setOpen(false)} className="text-text" />
              </li>
            ))}
          </ul>
          <Link
            to="/dashboard"
            className="mt-5 block rounded border border-[#333] px-4 py-2.5 text-center text-[12px] font-semibold tracking-[0.04em] text-text"
          >
            OPEN NOVA →
          </Link>
          <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold tracking-[0.06em]">
            <LiveDot />
            LIVE NOW
          </div>
        </div>
      )}
    </div>
  );
}
