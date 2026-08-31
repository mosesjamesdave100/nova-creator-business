import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { StatusBadge } from "./StatusBadge";
import { Reveal } from "./Reveal";
import { EmptyState } from "./EmptyState";
import { PageLinkButton } from "./PageLinkButton";
import {
  CONTENT_TYPES,
  CONTENT_STATUSES,
  scheduledContent as INITIAL_SCHEDULED,
  draftContent as INITIAL_DRAFTS,
} from "../data/contentPlanner";

// Anchored to this prototype's fixed "today" (see currentDate in the session
// context), the same convention already used for sponsorship deadlines and
// the next-stream card elsewhere in the app.
const TODAY_ISO = "2026-08-24";
const WEEK_LENGTH = 7;
const TYPE_IDS = Object.keys(CONTENT_TYPES);
const STATUS_TONE = { Idea: "muted", Planned: "accent", "In production": "warning", Ready: "good", Published: "good" };

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

function ContentRow({ item, onRemove, onEdit }) {
  const type = CONTENT_TYPES[item.type];
  return (
    <div className="group rounded-lg border border-hairline bg-bg px-3.5 py-3">
      <div className="flex items-start gap-3">
        <IconChip icon={type.icon} tone="muted" size={28} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium text-text">{item.title}</div>
          <div className="mt-0.5 text-[11px] text-muted">
            {type.label} &middot; {item.time}
          </div>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div>{item.status && <StatusBadge label={item.status} tone={STATUS_TONE[item.status]} />}</div>
        <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button type="button" onClick={() => onEdit(item)} aria-label={`Edit ${item.title}`} className="text-[11px] font-semibold text-faint hover:text-text">
            Edit
          </button>
          <button type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.title}`} className="text-faint hover:text-danger">
            <Icon name="close" size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateContentForm({ initial, onCancel, onSubmit }) {
  const isEditing = Boolean(initial?.id);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState(initial?.type ?? TYPE_IDS[0]);
  const [date, setDate] = useState(initial?.date ?? TODAY_ISO);
  const [time, setTime] = useState(initial?.time ?? "");
  const [status, setStatus] = useState(initial?.status ?? CONTENT_STATUSES[1]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ id: initial?.id, title: title.trim(), type, date, time: time.trim() || "TBD", status });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-hairline bg-surface p-5 md:p-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Content title"
          aria-label="Content title"
          autoFocus
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none md:col-span-2"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Content type"
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
        >
          {TYPE_IDS.map((id) => (
            <option key={id} value={id}>
              {CONTENT_TYPES[id].label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Status"
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
        >
          {CONTENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="flex gap-3 md:col-span-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Publish date"
            className="w-1/2 rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
          />
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 7:00 PM"
            aria-label="Publish time"
            className="w-1/2 rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className="rounded bg-accent px-5 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]">
          {isEditing ? "Save changes" : "Add to planner"}
        </button>
        <button type="button" onClick={onCancel} className="text-[13px] font-semibold text-muted hover:text-text">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ContentPlannerPage() {
  const location = useLocation();
  const [scheduled, setScheduled] = useState(INITIAL_SCHEDULED);
  const [drafts, setDrafts] = useState(INITIAL_DRAFTS);
  // Quick Actions ("+ New Content" / "Schedule Post") and NOVA's insight/
  // opportunity CTAs can deep-link here with router state asking the form to
  // already be open (optionally pre-filled with a recommended title/type),
  // so the action feels like it did something rather than just landing here.
  const [showForm, setShowForm] = useState(() => Boolean(location.state?.openForm));
  const [editingItem, setEditingItem] = useState(() => location.state?.prefill ?? null);

  const publishedItems = scheduled.filter((item) => item.status === "Published");
  const days = Array.from({ length: WEEK_LENGTH }, (_, i) => addDays(TODAY_ISO, i));

  function handleRemove(id) {
    setScheduled((prev) => prev.filter((item) => item.id !== id));
  }

  function handleEdit(item) {
    setEditingItem(item);
    setShowForm(true);
  }

  function handleFormSubmit(item) {
    if (item.id) {
      setScheduled((prev) => prev.map((existing) => (existing.id === item.id ? item : existing)));
    } else {
      setScheduled((prev) => [...prev, { id: `c-${Date.now()}`, ...item }]);
    }
    setEditingItem(null);
    setShowForm(false);
  }

  function handleScheduleDraft(draft) {
    setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
    setScheduled((prev) => [
      ...prev,
      { id: draft.id, type: draft.type, title: draft.title, date: TODAY_ISO, time: "TBD", status: "Planned" },
    ]);
  }

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted">
          Plan what's going out across every platform in one calendar. This is a plain editable plan for now, a real
          integration would let you publish directly to YouTube Studio, Twitch and TikTok from here.
        </p>
        <div className="flex shrink-0 gap-2">
          <PageLinkButton to="/analytics" label="View analytics" />
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setShowForm((v) => !v);
            }}
            className="flex shrink-0 items-center gap-1.5 rounded bg-accent px-4 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
          >
            <Icon name="plus" size={14} />
            CREATE CONTENT
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <CreateContentForm
            key={editingItem?.id ?? "new"}
            initial={editingItem}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onSubmit={handleFormSubmit}
          />
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
                    items.map((item) => <ContentRow key={item.id} item={item} onRemove={handleRemove} onEdit={handleEdit} />)
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

      {publishedItems.length > 0 && (
        <Reveal index={2} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Recently Published</h3>
          <p className="mt-1 text-xs text-muted">Already live, kept here for reference.</p>
          <div className="mt-5 flex flex-col gap-3 sm:grid sm:grid-cols-2">
            {publishedItems.map((item) => (
              <ContentRow key={item.id} item={item} onRemove={handleRemove} onEdit={handleEdit} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
