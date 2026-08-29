// Small hand-rolled icon set, no external icon library, kept to one
// consistent line weight so the sidebar and cards read as one system.
const PATHS = {
  overview: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  content: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h9A2.5 2.5 0 0 1 18 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 4 17.5v-11Zm6.2 3v5l4.3-2.5-4.3-2.5Z" />,
  store: <path d="M4 9.5 5.2 4h13.6l1.2 5.5M4 9.5v8A1.5 1.5 0 0 0 5.5 19h13a1.5 1.5 0 0 0 1.5-1.5v-8M4 9.5h16M9 13a3 3 0 0 0 6 0" />,
  products: <path d="M12 3.5 4.5 7.5v9L12 20.5l7.5-4v-9L12 3.5Zm0 0v8.5m0 0-7.5-4M12 12l7.5-4" />,
  memberships: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17" cy="9.5" r="2.4" />
      <path d="M15.5 12.5c2.4.2 4.2 1.9 4.5 4.3" />
    </>
  ),
  community: <path d="M4 6.8A2.8 2.8 0 0 1 6.8 4h10.4A2.8 2.8 0 0 1 20 6.8v6.4a2.8 2.8 0 0 1-2.8 2.8H10l-4.2 3.4v-3.4H6.8A2.8 2.8 0 0 1 4 13.2V6.8Z" />,
  analytics: <path d="M4.5 19.5v-15M4.5 19.5h15M8 16v-4.5M12.5 16V8M17 16v-7" />,
  messages: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8A2.5 2.5 0 0 1 17.5 17H9l-4 3v-3.5A2.5 2.5 0 0 1 4 14v-7.5Zm2 .8 6 4.2 6-4.2" />,
  sponsors: <path d="m12 4 2.2 4.6 5 .7-3.6 3.6.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.6 5-.7L12 4Z" />,
  payouts: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M3.5 10h17" />
      <circle cx="16.5" cy="14" r="1.4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.66 6.34l-1.42 1.42M7.76 16.24l-1.42 1.42M17.66 17.66l-1.42-1.42M7.76 7.76 6.34 6.34" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.3a2.4 2.4 0 1 1 3.4 2.2c-.9.4-1 1-1 1.9" />
      <circle cx="12" cy="16.5" r="0.15" fill="currentColor" stroke="none" />
    </>
  ),
  bell: <path d="M6 9a6 6 0 1 1 12 0c0 3.2 1 4.4 1.5 5.1H4.5C5 13.4 6 12.2 6 9Zm3.5 8.5a2.5 2.5 0 0 0 5 0" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  bag: <path d="M6 8V6.5a4 4 0 0 1 8 0V8m-9.5 0h11l.8 11.5a1.5 1.5 0 0 1-1.5 1.6H6.2a1.5 1.5 0 0 1-1.5-1.6L5.5 8Z" />,
  users: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17" cy="9.5" r="2.2" />
      <path d="M15.6 12.6c2.2.3 3.9 2 4.1 4.2" />
    </>
  ),
  download: <path d="M12 4v11m0 0-4-4m4 4 4-4M5 18.5h14" />,
  youtube: (
    <>
      <rect x="3.5" y="6.5" width="17" height="11" rx="3" />
      <path d="M10.5 10.2v3.6l3.2-1.8-3.2-1.8Z" fill="currentColor" stroke="none" />
    </>
  ),
  payout: <path d="M4 12h8M12 12l-3-3M12 12l-3 3M14 7h6v10h-6" />,
  play: <path d="M9 7.5v9l7-4.5-7-4.5Z" fill="currentColor" stroke="none" />,
  arrowUp: <path d="M12 19V5m0 0-5 5m5-5 5 5" />,
  arrowDown: <path d="M12 5v14m0 0-5-5m5 5 5-5" />,
  external: <path d="M9 6h9v9M17.5 6.5 6 18" />,
  calendar: <path d="M4.5 5.5h15v14h-15v-14Zm0 4h15M8 3v3M16 3v3" />,
  revenue: <path d="M12 3.5v17M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.2-4.5 3c0 4 9 2.2 9 6.2 0 1.8-2 3.3-4.5 3.3s-4.5-1.3-4.5-3.3" />,
  gift: (
    <>
      <rect x="4" y="9" width="16" height="10.5" rx="1.5" />
      <path d="M4 13h16M12 9v10.5M8.3 9C7 9 6 8 6 6.7 6 5.5 7 4.5 8.3 4.5c2 0 3.7 2.4 3.7 4.5-1.7 0-3.7 0-3.7 0Zm7.4 0C17 9 18 8 18 6.7c0-1.2-1-2.2-2.3-2.2-2 0-3.7 2.4-3.7 4.5 1.7 0 3.7 0 3.7 0Z" />
    </>
  ),
  trendingUp: <path d="M4 16.5 10 10l4 4 6.5-7.5M15 8h5.5v5.5" />,
  integrations: (
    <>
      <rect x="3.5" y="9.5" width="6" height="6" rx="1.5" />
      <rect x="14.5" y="9.5" width="6" height="6" rx="1.5" />
      <path d="M9.5 12.5h5" />
    </>
  ),
  sparkle: <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7l-1.6-5.5L5 10.6l5.4-1.6L12 3.5Z" />,
  mediaKit: (
    <>
      <rect x="4" y="4.5" width="16" height="15" rx="1.5" />
      <path d="M8 9h8M8 12.5h8M8 16h5" />
    </>
  ),
  link: <path d="M9.5 14.5 14.5 9.5M10.5 8l1-1a3 3 0 0 1 4.5 4l-1 1M13.5 16l-1 1a3 3 0 0 1-4.5-4l1-1" />,
  copy: (
    <>
      <rect x="4.5" y="4.5" width="12" height="12" rx="1.5" />
      <path d="M8.5 8.5V6a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 19.5 6v8a1.5 1.5 0 0 1-1.5 1.5h-2.5" />
    </>
  ),
  print: (
    <>
      <path d="M7 8.5V4.5h10v4" />
      <rect x="4.5" y="8.5" width="15" height="8" rx="1.5" />
      <path d="M7 14.5h10v5H7v-5Z" />
    </>
  ),
  check: <path d="M4.5 12.5 9 17l10.5-11" />,
  arrowLeft: <path d="M20 12H4m0 0 6-6m-6 6 6 6" />,
  arrowRight: <path d="M4 12h16m0 0-6-6m6 6-6 6" />,
  plus: <path d="M12 4.5v15M4.5 12h15" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  inbox: <path d="M4 12.5h4.5l1.5 2.5h4l1.5-2.5H20M4.8 6.5h14.4L20 12.5v6a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-6L4.8 6.5Z" />,
  alert: (
    <>
      <path d="M12 3.5 21 19.5H3L12 3.5Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.7" r="0.15" fill="currentColor" stroke="none" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m19.5 19.5-4.35-4.35" />
    </>
  ),
};

export function Icon({ name, size = 18, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {PATHS[name] ?? null}
    </svg>
  );
}
