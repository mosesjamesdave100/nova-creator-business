import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { useClickOutside } from "../hooks/useClickOutside";
import { searchIndex, SEARCH_GROUPS } from "../data/searchIndex";

const QUICK_NAV = searchIndex.filter((entry) => entry.group === "page").slice(0, 8);
const MAX_RESULTS = 8;

function filterEntries(query) {
  const q = query.trim().toLowerCase();
  if (!q) return QUICK_NAV;
  return searchIndex.filter((entry) => `${entry.title} ${entry.subtitle}`.toLowerCase().includes(q)).slice(0, MAX_RESULTS);
}

// Groups a flat, already-ordered result list into [{ group, entries }] without
// resorting - insertion order already matches searchIndex's own grouping.
function groupResults(results) {
  const groups = [];
  for (const entry of results) {
    const last = groups[groups.length - 1];
    if (last && last.group === entry.group) {
      last.entries.push(entry);
    } else {
      groups.push({ group: entry.group, entries: [entry] });
    }
  }
  return groups;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = filterEntries(query);

  useClickOutside(panelRef, () => setOpen(false), open);

  // Global "open search" shortcut, listens regardless of whether the palette
  // is already open so Cmd/Ctrl+K always works from anywhere in the dashboard.
  useEffect(() => {
    function handleKeyDown(event) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        setOpen((v) => {
          if (v) return false;
          setQuery("");
          setActiveIndex(0);
          return true;
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(timer);
  }, [open]);

  function openPalette() {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }

  function handleQueryChange(value) {
    setQuery(value);
    setActiveIndex(0);
  }

  function select(entry) {
    if (!entry) return;
    navigate(entry.to);
    setOpen(false);
  }

  function handleInputKeyDown(event) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(results[activeIndex]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="flex items-center gap-2.5 rounded-md border border-hairline bg-surface px-3.5 py-2 text-sm text-muted transition-colors hover:border-[#333] hover:text-text"
      >
        <Icon name="search" size={15} />
        <span className="hidden sm:inline">Search NOVA</span>
        <span className="hidden rounded border border-hairline bg-bg px-1.5 py-0.5 text-[10px] font-semibold text-faint md:inline">
          &#8984;K
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/60 px-4 pt-[12vh]">
          <div
            ref={panelRef}
            className="h-fit w-full max-w-lg overflow-hidden rounded-xl border border-hairline bg-surface-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
          >
            <div className="flex items-center gap-3 border-b border-hairline px-4 py-3.5">
              <Icon name="search" size={16} className="shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search content, brand deals, products, insights…"
                className="w-full bg-transparent text-sm text-text placeholder:text-faint focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="shrink-0 text-faint hover:text-text"
              >
                <Icon name="close" size={15} />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto py-2">
              {results.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted">No results for "{query}".</div>
              ) : (
                groupResults(results).map((group) => (
                  <div key={group.group} className="px-2 py-1.5">
                    <div className="px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-faint">
                      {SEARCH_GROUPS[group.group].toUpperCase()}
                    </div>
                    {group.entries.map((entry) => {
                      const globalIndex = results.indexOf(entry);
                      const active = globalIndex === activeIndex;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => select(entry)}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors ${
                            active ? "bg-accent/10 text-text" : "text-text hover:bg-surface"
                          }`}
                        >
                          <Icon name={entry.icon} size={15} className={active ? "text-accent" : "text-muted"} />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[13px] font-medium">{entry.title}</div>
                            <div className="truncate text-[11px] text-muted">{entry.subtitle}</div>
                          </div>
                          {active && <Icon name="arrowRight" size={13} className="shrink-0 text-accent" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
