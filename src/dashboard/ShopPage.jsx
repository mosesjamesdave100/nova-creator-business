import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "./Icon";
import { IconChip } from "./IconChip";
import { Sparkline } from "./Sparkline";
import { StatusBadge } from "./StatusBadge";
import { Reveal } from "./Reveal";
import {
  products as INITIAL_PRODUCTS,
  recentOrders,
  totalRevenue30d,
  totalOrders30d,
  bestSellers,
  conversionRatePct,
} from "../data/shop";
import { currencyWhole } from "../data/format";

const INVENTORY_TONE = { "In stock": "good", "Low stock": "warning", "Out of stock": "danger" };
const ORDER_STATUS_TONE = { Fulfilled: "good", Processing: "muted", Refunded: "danger" };
const CATEGORY_ICON = { Apparel: "bag", Digital: "download" };
const FLAT_SPARKLINE = Array.from({ length: 10 }, () => 0.4);

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="text-[11px] font-semibold tracking-[0.08em] text-muted">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}

function NewProductForm({ onCancel, onCreate }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    onCreate({
      name: name.trim(),
      category,
      price: Number(price),
      inventory: inventory ? Number(inventory) : null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-hairline bg-surface p-5 md:p-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          autoFocus
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none md:col-span-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
        >
          <option value="Apparel">Apparel</option>
          <option value="Digital">Digital</option>
        </select>
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price ($)"
            className="w-1/2 rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
          />
          <input
            type="number"
            min="0"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            placeholder="Inventory (optional)"
            className="w-1/2 rounded-md border border-hairline bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className="rounded bg-accent px-5 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]">
          Add product
        </button>
        <button type="button" onClick={onCancel} className="text-[13px] font-semibold text-muted hover:text-text">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ShopPage() {
  const location = useLocation();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [showForm, setShowForm] = useState(() => Boolean(location.state?.openForm));

  function handleCreate({ name, category, price, inventory }) {
    setProducts((prev) => [
      ...prev,
      {
        id: `product-${Date.now()}`,
        name,
        category,
        icon: CATEGORY_ICON[category],
        price,
        inventory,
        inventoryStatus: inventory === null || inventory > 0 ? "In stock" : "Out of stock",
        revenue30d: 0,
        orders30d: 0,
        trendPct: 0,
        revenueSharePct: 0,
        sparkline: FLAT_SPARKLINE,
      },
    ]);
    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-[1800px] px-5 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted">
          Products, orders and inventory for the store. NOVA is not an ecommerce processor itself, connect Shopify
          (or another storefront) under Integrations so its catalog, inventory and orders flow in here instead of
          living in a separate dashboard. Mock data for this prototype.
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex shrink-0 items-center gap-1.5 rounded bg-accent px-4 py-2.5 text-[13px] font-semibold text-bg transition-transform hover:scale-[1.02]"
        >
          <Icon name="plus" size={14} />
          NEW PRODUCT
        </button>
      </div>

      {showForm && <NewProductForm onCancel={() => setShowForm(false)} onCreate={handleCreate} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="REVENUE (30D)" value={currencyWhole.format(totalRevenue30d)} />
        <SummaryCard label="ORDERS (30D)" value={totalOrders30d} />
        <SummaryCard label="CONVERSION RATE" value={`${conversionRatePct.toFixed(1)}%`} />
        <SummaryCard label="BEST SELLER" value={bestSellers[0].name} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Reveal index={0} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Products</h3>
          <div className="mt-5 flex flex-col">
            {products.map((product, i) => {
              const positive = product.trendPct >= 0;
              return (
                <div
                  key={product.id}
                  className={`flex flex-wrap items-center gap-3.5 py-3.5 ${
                    i !== products.length - 1 ? "border-b border-hairline" : ""
                  }`}
                >
                  <IconChip icon={product.icon} tone="muted" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-text">{product.name}</div>
                    <div className="mt-0.5 text-[13px] text-muted">
                      {product.category} &middot; {currencyWhole.format(product.price)}
                    </div>
                  </div>
                  <StatusBadge label={product.inventoryStatus} tone={INVENTORY_TONE[product.inventoryStatus]} />
                  <div className="w-24 shrink-0 text-right text-sm text-text">
                    {currencyWhole.format(product.revenue30d)}
                  </div>
                  <Sparkline points={product.sparkline} positive={positive} width={56} height={22} />
                  <div className={`flex w-14 shrink-0 items-center justify-end gap-1 text-[13px] ${positive ? "text-good" : "text-danger"}`}>
                    <Icon name={positive ? "arrowUp" : "arrowDown"} size={11} />
                    {Math.abs(product.trendPct)}%
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal index={1} className="rounded-xl border border-hairline bg-surface p-5 md:p-7">
          <h3 className="font-display text-lg font-semibold">Recent Orders</h3>
          <div className="mt-5 flex flex-col">
            {recentOrders.map((order, i) => (
              <div
                key={order.id}
                className={`flex items-center justify-between gap-3 py-3.5 ${
                  i !== recentOrders.length - 1 ? "border-b border-hairline" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="text-sm text-text">{order.id}</div>
                  <div className="mt-0.5 truncate text-[13px] text-muted">{order.product}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold text-text">{currencyWhole.format(order.amount)}</div>
                  <div className="mt-1">
                    <StatusBadge label={order.status} tone={ORDER_STATUS_TONE[order.status]} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
