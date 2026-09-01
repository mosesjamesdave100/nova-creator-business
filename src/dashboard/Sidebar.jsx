import { NavLink } from "react-router-dom";
import { Icon } from "./Icon";
import { Avatar } from "./Avatar";
import { NAV_ITEMS } from "./navigation";
import { creator } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

function NavRow({ item, onNavigate }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === "/dashboard"}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
          isActive ? "bg-surface-2 text-text" : "text-muted hover:bg-surface hover:text-text"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${isActive ? "bg-accent" : "bg-transparent"}`}
          />
          <Icon name={item.icon} size={17} className={isActive ? "text-text" : "text-muted group-hover:text-text"} />
          <span className="truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-bg">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ onNavigate }) {
  const { profile } = useAuth();
  const accountName = profile?.display_name || creator.name;
  const accountSubtitle = profile?.email || "Sample Workspace";

  return (
    <div className="flex h-full flex-col bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-5 pb-6 pt-6">
        <span className="font-display text-lg font-bold tracking-[0.02em]">{creator.name}</span>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          aria-label="View public site"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-text"
        >
          <Icon name="external" size={15} />
        </a>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavRow key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>

      <div className="border-t border-hairline p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-text"
        >
          <Icon name="help" size={17} />
          Help &amp; Support
        </button>
        <div className="mt-1 flex items-center gap-3 rounded-md px-3 py-2.5">
          <Avatar size={32} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-text">{accountName}</div>
            <div className="truncate text-xs text-muted">{accountSubtitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
