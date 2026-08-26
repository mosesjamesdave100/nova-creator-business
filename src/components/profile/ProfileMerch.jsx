import { SectionHeading } from "../landing/SectionHeading";
import { IconChip } from "../../dashboard/IconChip";
import { products } from "../../data/shop";
import { currencyWhole } from "../../data/format";

// Public storefront view: name, category and price only, no revenue or
// order figures - that's private business data, not something a brand or
// fan visiting this page should see.
const IN_STOCK = products.filter((p) => p.inventoryStatus !== "Out of stock");

export function ProfileMerch() {
  return (
    <section id="shop" className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-20 lg:px-16">
      <SectionHeading eyebrow="04 — SHOP" heading="Merch & digital products" />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {IN_STOCK.map((product) => (
          <div key={product.id} className="flex items-center gap-3.5 rounded-xl border border-hairline bg-surface p-5">
            <IconChip icon={product.icon} tone="muted" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-text">{product.name}</div>
              <div className="mt-0.5 text-[13px] text-muted">{product.category}</div>
            </div>
            <div className="shrink-0 font-display text-base font-semibold text-text">
              {currencyWhole.format(product.price)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
