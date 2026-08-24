import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { Sparkline } from "./Sparkline";
import { products } from "../data/mockData";
import { currencyWhole } from "../data/format";

export function ProductList() {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Top Performing Products</h3>
        <Link to="/shop" className="text-xs font-semibold text-muted hover:text-text">
          View all
        </Link>
      </div>
      <div className="mt-5 flex flex-col">
        {products.map((product, i) => {
          const positive = product.trendPct >= 0;
          return (
            <div
              key={product.id}
              className={`flex items-center gap-3.5 py-3.5 ${
                i !== products.length - 1 ? "border-b border-hairline" : ""
              }`}
            >
              <IconChip icon={product.icon} tone="muted" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-text">{product.name}</div>
                <div className="mt-0.5 text-[13px] text-muted">
                  {currencyWhole.format(product.revenue)} &middot; {product.orders} orders &middot;{" "}
                  {product.revenueSharePct}% of total
                </div>
              </div>
              <Sparkline points={product.sparkline} positive={positive} width={64} height={24} />
              <div className={`flex shrink-0 items-center gap-1 text-[13px] ${positive ? "text-good" : "text-danger"}`}>
                <Icon name={positive ? "arrowUp" : "arrowDown"} size={12} />
                {Math.abs(product.trendPct)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
