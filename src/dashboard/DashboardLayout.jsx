import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { NAV_ITEMS } from "./navigation";

function topBarCopyFor(pathname) {
  if (pathname === "/dashboard") {
    return {
      title: "Good morning, NOVA \u{1F44B}",
      subtitle: "Here's how your creator business is performing today.",
    };
  }
  const match = NAV_ITEMS.find((item) => item.path === pathname);
  return { title: match ? match.label : "Dashboard", subtitle: undefined };
}

// Wraps each route's content in the same fade-up used elsewhere, swapping to
// a plain resting class once it finishes so the transform retained by
// animation-fill-mode: forwards doesn't linger - a lingering transform turns
// this wrapper into a CSS containing block, trapping any `position: fixed`
// modal rendered anywhere on the page instead of letting it center on the
// real viewport (see the .reveal rules in index.css).
function RouteReveal({ children }) {
  const [done, setDone] = useState(false);
  return (
    <div className={`reveal ${done ? "is-done" : "is-in"}`} onAnimationEnd={() => setDone(true)}>
      {children}
    </div>
  );
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { title, subtitle } = topBarCopyFor(pathname);

  return (
    <div id="dashboard-shell" className="flex h-screen overflow-hidden bg-bg text-text">
      <div className="hidden w-60 shrink-0 border-r border-hairline lg:block print:hidden">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden print:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-hairline">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="print:hidden">
          <TopBar title={title} subtitle={subtitle} onOpenSidebar={() => setSidebarOpen(true)} />
        </div>
        <div id="dashboard-scroll" className="flex-1 overflow-y-auto">
          <RouteReveal key={pathname}>
            <Outlet />
          </RouteReveal>
        </div>
      </div>
    </div>
  );
}
