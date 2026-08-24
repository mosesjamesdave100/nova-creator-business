import { useState } from "react";
import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { Reveal } from "./Reveal";
import { EmptyState } from "./EmptyState";
import { CONTENT_TYPES, scheduledContent as INITIAL_SCHEDULED, draftContent as INITIAL_DRAFTS } from "../data/contentPlanner";

// Anchored to this prototype's fixed "today" (see currentDate in the session
// context), the same convention already used for sponsorship deadlines and
// the next-stream card elsewhere in the app.
const TODAY_ISO = "2026-08-24";
const WEEK_LENGTH = 7;
const TYPE_IDS = Object.keys(CONTENT_TYPES);

function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function dayLabel(iso) {
  const d = new Date(`${iso}T00:00:00`);
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  return { weekday, day: d.getDate() };
}

function ContentRow({ item, onRemove }) {
  const type = CONTENT_TYPES[item.type];
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-hairline bg-bg px-3.5 py-3">
      <IconChip icon={type.icon} tone="muted" size={28} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-text">{item.title}</div>
        <div className="mt-0.5 text-[11px] text-muted">
          {type.label} &middot; {item.time}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label="Remove"
        className="shrink-0 text-faint opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
      >
        <Icon name="close" size={13} />
      </button>
    </div>
  );
}

function CreateContentForm({ onCancel, onCreate }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState(TYPE_IDS[0]);
  const [date, setDate] = useState(TODAY_ISO);
  const [time, setTime] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), type, date, time: time.trim() || "TBD" });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-hairline bg-surface p-5 md:p-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Content title"
          autoFocus
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none md:col-span-2"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
        >
          {TYPE_IDS.map((id) => (
            <option key={id} value={id}>
              {CONTENT_TYPES[id].label}
            </option>
          ))}
        </select>
        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-1/2 rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
          />
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 7:00 PM"
            className="w-1/2 rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className="rounded bg-accent px-5 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]">
          Add to planner
        </button>
        <button type="button" onClick={onCancel} className="text-[13px] font-semibold text-muted hover:text-text">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ContentPlannerPage() {
  const [scheduled, setScheduled] = useState(INITIAL_SCHEDULED);
  const [drafts, setDrafts] = useState(INITIAL_DRAFTS);
  const [showForm, setShowForm] = useState(false);

  const days = Array.from({ length: WEEK_LENGTH }, (_, i) => addDays(TODAY_ISO, i));

  function handleRemove(id) {
    setScheduled((prev) => prev.filter((item) => item.id !== id));
  }

  function handleCreate(item) {
    setScheduled((prev) => [...prev, { id: `c-${Date.now()}`, ...item }]);
    setShowForm(false);
  }

  function handleScheduleDraft(draft) {
    setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
    setScheduled((prev) => [...prev, { id: draft.id, type: draft.type, title: draft.title, date: TODAY_ISO, time: "TBD" }]);
  }

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted">
          Plan what's going out across every platform in one calendar. This is a plain editable plan for now, a real
          integration would let you publish directly to YouTube Studio, Twitch and TikTok from here.
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex shrink-0 items-center gap-1.5 rounded bg-accent px-4 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          <Icon name="plus" size={14} />
          CREATE CONTENT
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <CreateContentForm onCancel={() => setShowForm(false)} onCreate={handleCreate} />
        </div>
      )}

      <Reveal index={0} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <h3 className="font-display text-lg font-semibold">This Week</h3>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {days.map((iso) => {
            const { weekday, day } = dayLabel(iso);
            const items = scheduled.filter((item) => item.date === iso);
            return (
              <div key={iso} className="rounded-lg border border-hairline bg-bg/40 p-3">
                <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">
                  {weekday} {day}
                </div>
                <div className="mt-2.5 flex flex-col gap-2">
                  {items.length === 0 ? (
                    <div className="rounded-md border border-dashed border-hairline px-2.5 py-4 text-center text-[11px] text-faint">
                      No content scheduled
                    </div>
                  ) : (
                    items.map((item) => <ContentRow key={item.id} item={item} onRemove={handleRemove} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>

      <Reveal index={1} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <h3 className="font-display text-lg font-semibold">Drafts</h3>
        <p className="mt-1 text-xs text-muted">Not scheduled yet.</p>
        {drafts.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              icon="inbox"
              title="No drafts"
              description="Everything you're working on has been scheduled."
              compact
            />
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3 sm:grid sm:grid-cols-2">
            {drafts.map((draft) => {
              const type = CONTENT_TYPES[draft.type];
              return (
                <div key={draft.id} className="flex items-center gap-3 rounded-lg border border-hairline bg-bg px-3.5 py-3">
                  <IconChip icon={type.icon} tone="muted" size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-text">{draft.title}</div>
                    <div className="mt-0.5 text-[11px] text-muted">
                      {type.label} &middot; {draft.note}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleScheduleDraft(draft)}
                    className="shrink-0 text-[12px] font-semibold text-accent hover:underline"
                  >
                    Schedule
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Reveal>
    </div>
  );
}
