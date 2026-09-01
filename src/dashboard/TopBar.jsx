import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { Avatar } from "./Avatar";
import { useClickOutside } from "../hooks/useClickOutside";
import { useAuth } from "../context/AuthContext";
import { DEMO_MODE } from "../data/connections";
import { notifications as INITIAL_NOTIFICATIONS, NOTIFICATION_CATEGORIES } from "../data/notifications";
import { GlobalSearch } from "./GlobalSearch";

const DATE_PRESETS = ["Today", "Last 7 days", "Last 30 days", "Last 90 days"];

function DateSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Last 30 days");
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-hairline bg-surface px-3.5 py-2 text-sm text-text transition-colors hover:border-[#333]"
      >
        <Icon name="calendar" size={15} className="text-muted" />
        {selected}
        <Icon name="chevronDown" size={14} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border border-hairline bg-surface-2 py-1.5 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6)]">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setSelected(preset);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm text-text hover:bg-surface"
            >
              {preset}
              {selected === preset && <span className="text-accent">&#10003;</span>}
            </button>
          ))}
          <div className="mt-1 border-t border-hairline px-3.5 pt-2 text-xs text-muted">Custom range</div>
        </div>
      )}
    </div>
  );
}

function Notifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const unreadCount = items.filter((n) => !n.read).length;

  function markRead(id) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleSelect(id) {
    markRead(id);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-surface text-muted transition-colors hover:border-[#333] hover:text-text"
      >
        <Icon name="bell" size={17} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-bg">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-md border border-hairline bg-surface-2 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <span className="text-sm font-semibold text-text">Notifications</span>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead} className="text-[12px] font-semibold text-accent hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="flex max-h-96 flex-col overflow-y-auto">
            {items.map((n) => {
              const meta = NOTIFICATION_CATEGORIES[n.category];
              return (
                <Link
                  key={n.id}
                  to={n.cta.to}
                  onClick={() => handleSelect(n.id)}
                  className={`flex items-start gap-3 border-b border-hairline px-4 py-3 text-left last:border-0 transition-colors hover:bg-surface ${
                    n.read ? "" : "bg-accent/[0.04]"
                  }`}
                >
                  <IconChip icon={meta.icon} tone={meta.tone} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted">
                      {meta.label.toUpperCase()}
                      {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                    </div>
                    <div className={`mt-1 text-[13px] leading-snug ${n.read ? "text-muted" : "text-text"}`}>{n.detail}</div>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-faint">{n.time}</span>
                      <span className="text-[11px] font-semibold text-accent">{n.cta.label} &rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-surface"
      >
        <Avatar size={32} />
        <Icon name="chevronDown" size={14} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-md border border-hairline bg-surface-2 py-1.5 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6)]">
          {profile?.email && (
            <div className="truncate border-b border-hairline px-3.5 pb-2 pt-1 text-xs text-faint">{profile.email}</div>
          )}
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex w-full px-3.5 py-2 text-left text-sm text-text hover:bg-surface"
          >
            Account settings
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full px-3.5 py-2 text-left text-sm text-danger hover:bg-surface"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function TopBar({ title, subtitle, onOpenSidebar }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline px-5 py-5 md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-muted lg:hidden"
        >
          <Icon name="overview" size={16} />
        </button>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-xl font-semibold md:text-2xl">{title}</h1>
            {DEMO_MODE && (
              <span
                title="Sample Workspace: every number in this dashboard is mock data, not a live account connection."
                className="inline-flex shrink-0 items-center gap-1.5 rounded bg-accent/10 px-2 py-1 text-[10px] font-semibold tracking-[0.06em] text-accent"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                DEMO MODE
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <GlobalSearch />
        <DateSelector />
        <Notifications />
        <ProfileMenu />
      </div>
    </div>
  );
}
