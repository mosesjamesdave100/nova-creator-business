import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "./Icon";
import { EmptyState } from "./EmptyState";
import { PageLinkButton } from "./PageLinkButton";
import { PIPELINE_STAGES, sponsorships as INITIAL_DEALS } from "../data/sponsorships";
import { currencyWhole } from "../data/format";

function formatDeadline(iso) {
  if (!iso) return "No deadline yet";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{currencyWhole.format(value)}</div>
    </div>
  );
}

function DealCard({ deal }) {
  return (
    <div className="rounded-lg border border-hairline bg-bg p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold text-text">{deal.brand}</div>
        <div className="shrink-0 font-display text-sm font-semibold text-accent">{currencyWhole.format(deal.value)}</div>
      </div>
      {deal.campaign && <div className="mt-0.5 text-[13px] text-muted">{deal.campaign}</div>}
      <div className="mt-2.5 text-xs text-muted">{deal.deliverables}</div>
      <div className="mt-2.5 flex items-center justify-between border-t border-hairline pt-2.5 text-xs text-faint">
        <span>Due {formatDeadline(deal.deadline)}</span>
      </div>
      {deal.notes && <div className="mt-2 text-[12px] italic leading-relaxed text-muted">{deal.notes}</div>}
    </div>
  );
}

function StageColumn({ stage, deals }) {
  const stageValue = deals.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="flex flex-col rounded-xl border border-hairline bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">
          {stage.toUpperCase()} &middot; {deals.length}
        </div>
        <div className="text-[11px] font-semibold text-faint">{currencyWhole.format(stageValue)}</div>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {deals.length === 0 ? (
          <EmptyState icon="inbox" title="No deals here" compact />
        ) : (
          deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
        )}
      </div>
    </div>
  );
}

const EMPTY_DEAL = { brand: "", campaign: "", value: "", stage: PIPELINE_STAGES[0], deliverables: "", deadline: "", notes: "" };

function NewDealForm({ onCancel, onCreate }) {
  const [form, setForm] = useState(EMPTY_DEAL);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.brand.trim() || !form.value) return;
    onCreate({
      brand: form.brand.trim(),
      campaign: form.campaign.trim() || null,
      value: Number(form.value),
      stage: form.stage,
      deliverables: form.deliverables.trim() || "Not yet scoped",
      deadline: form.deadline || null,
      notes: form.notes.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-hairline bg-surface p-5 md:p-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          value={form.brand}
          onChange={(e) => update("brand", e.target.value)}
          placeholder="Brand name"
          aria-label="Brand name"
          autoFocus
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
        />
        <input
          value={form.campaign}
          onChange={(e) => update("campaign", e.target.value)}
          placeholder="Campaign (optional)"
          aria-label="Campaign"
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
        />
        <input
          type="number"
          min="0"
          value={form.value}
          onChange={(e) => update("value", e.target.value)}
          placeholder="Deal value ($)"
          aria-label="Deal value in dollars"
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
        />
        <select
          value={form.stage}
          onChange={(e) => update("stage", e.target.value)}
          aria-label="Pipeline stage"
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
        >
          {PIPELINE_STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          value={form.deliverables}
          onChange={(e) => update("deliverables", e.target.value)}
          placeholder="Deliverables"
          aria-label="Deliverables"
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none md:col-span-2"
        />
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => update("deadline", e.target.value)}
          aria-label="Deadline"
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
        />
        <input
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Notes"
          aria-label="Notes"
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className="rounded bg-accent px-5 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]">
          Add deal
        </button>
        <button type="button" onClick={onCancel} className="text-[13px] font-semibold text-muted hover:text-text">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function SponsorshipsPage() {
  const location = useLocation();
  const [deals, setDeals] = useState(INITIAL_DEALS);
  // "+ Add Brand Deal" in Quick Actions deep-links here with router state
  // asking the form to already be open.
  const [showForm, setShowForm] = useState(() => Boolean(location.state?.openForm));

  function handleCreate(deal) {
    setDeals((prev) => [...prev, { id: `sp-${Date.now()}`, ...deal }]);
    setShowForm(false);
  }

  const totalDealValue = deals.reduce((sum, d) => sum + d.value, 0);
  const totalPipelineValue = deals
    .filter((d) => d.stage === "Lead" || d.stage === "Negotiating" || d.stage === "Active")
    .reduce((sum, d) => sum + d.value, 0);
  const totalPaidValue = deals.filter((d) => d.stage === "Paid").reduce((sum, d) => sum + d.value, 0);
  const totalOutstandingValue = deals.filter((d) => d.stage === "Delivered").reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted">
          Every brand deal moves through one pipeline: Lead, Negotiating, Active, Delivered, Paid. This is a
          manually-logged record, not something a platform API supplies.
        </p>
        <div className="flex shrink-0 gap-2">
          <PageLinkButton to="/media-kit" label="Update media kit" />
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex shrink-0 items-center gap-1.5 rounded bg-accent px-4 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
          >
            <Icon name="plus" size={14} />
            NEW DEAL
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <NewDealForm onCancel={() => setShowForm(false)} onCreate={handleCreate} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="TOTAL DEAL VALUE" value={totalDealValue} />
        <SummaryCard label="PIPELINE VALUE" value={totalPipelineValue} />
        <SummaryCard label="PAID OUT" value={totalPaidValue} />
        <SummaryCard label="OUTSTANDING" value={totalOutstandingValue} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {PIPELINE_STAGES.map((stage) => (
          <StageColumn key={stage} stage={stage} deals={deals.filter((d) => d.stage === stage)} />
        ))}
      </div>
    </div>
  );
}
