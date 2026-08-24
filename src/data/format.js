// Shared number formatting so every dashboard page renders figures the same
// way, whether they come from mock data now or a real API response later.
export const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const currencyWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCompactNumber(value) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `${value}`;
}

export function formatCompactCurrency(value) {
  return `$${formatCompactNumber(Math.round(value))}`;
}

export function formatSignedPct(pct, digits = 1) {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(digits).replace(/\.0$/, "")}%`;
}
