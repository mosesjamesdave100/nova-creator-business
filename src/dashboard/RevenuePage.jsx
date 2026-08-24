import { useState } from "react";
import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { LineChart } from "./LineChart";
import { Reveal } from "./Reveal";
import { ranges, defaultRange, sources, totalRevenue30d, recentTransactions } from "../data/revenue";
import { currency, currencyWhole, formatCompactCurrency } from "../data/format";

const TRANSACTION_ICON = { payout: "payout", sponsorship: "sponsors", order: "bag" };

const RANGE_TABS = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
  { id: "12m", label: "12M" },
];

function SourceRow({ source }) {
  const positive = source.deltaPct >= 0;
  const sharePct = Math.round((source.total / totalRevenue30d) * 100);

  return (
    <div className="py-3.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: source.color }} />
          <span className="text-text">{source.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 text-[13px] ${positive ? "text-good" : "text-danger"}`}>
            <Icon name={positive ? "arrowUp" : "arrowDown"} size={11} />
            {Math.abs(source.deltaPct)}%
          </span>
          <span className="w-20 text-right font-semibold text-text">{currencyWhole.format(source.total)}</span>
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${sharePct}%`, background: source.color }}
        />
      </div>
    </div>
  );
}

export function RevenuePage() {
  const [rangeId, setRangeId] = useState(defaultRange);
  const range = ranges[rangeId];
  const values = range.points.map((p) => p.value);
  const dates = range.points.map((p) => p.date);

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Full business revenue by source (broader than the Overview snapshot, this includes ad revenue and
        sponsorships). Mock data for this prototype, connect Stripe and Shopify under Integrations to replace it.
      </p>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
        <Reveal index={0} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold">Revenue Overview</h3>
              <div className="mt-3 font-display text-[32px] font-semibold leading-none">
                {currency.format(range.total)}
              </div>
              <div className="mt-2 text-[13px] text-good">+{range.deltaPct}% vs previous period</div>
            </div>
            <div className="flex gap-1 rounded-md border border-hairline bg-bg p-1">
              {RANGE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRangeId(tab.id)}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                    rangeId === tab.id ? "bg-surface-2 text-text" : "text-muted hover:text-text"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-7">
            <LineChart
              series={[{ id: "revenue", color: "#c7ff3d", values }]}
              dates={dates}
              formatValue={(v) => currency.format(v)}
              formatTick={formatCompactCurrency}
              showArea
            />
          </div>
        </Reveal>

        <Reveal index={1} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Revenue by Source</h3>
          <p className="mt-1 text-xs text-muted">Last 30 days</p>
          <div className="mt-4 flex flex-col divide-y divide-hairline">
            {sources.map((source) => (
              <SourceRow key={source.id} source={source} />
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal index={2} className="mt-6 rounded-xl border border-hairline bg-surface p-5 md:p-7">
        <h3 className="font-display text-lg font-semibold">Recent Transactions</h3>
        <div className="mt-4 flex flex-col divide-y divide-hairline">
          {recentTransactions.map((txn) => (
            <div key={txn.id} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
              <IconChip icon={TRANSACTION_ICON[txn.type]} tone="muted" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-text">{txn.label}</div>
                <div className="mt-0.5 text-xs text-muted">{txn.timestamp}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-semibold text-text">{currencyWhole.format(txn.amount)}</div>
                <div className="mt-0.5 text-xs text-good">{txn.status}</div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
