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
          <div key={pathname} className="reveal is-in">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
