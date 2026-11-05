import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { StoreShell, Reveal } from "@/components/auren/StoreShell";
import { ProductCard } from "@/components/auren/ProductCard";
import { CATALOG, CATEGORIES } from "@/lib/catalog";
export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "The collection — AUREN" }] }),
  component: Shop,
});
function Shop() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("edit");
  const products = useMemo(
    () =>
      CATALOG.filter(
        ({ product: p }) =>
          (category === "All" || p.category === category) &&
          `${p.name} ${p.color} ${p.category}`.toLowerCase().includes(query.toLowerCase()),
      ).sort((a, b) =>
        sort === "low"
          ? a.product.price - b.product.price
          : sort === "high"
            ? b.product.price - a.product.price
            : 0,
      ),
    [category, query, sort],
  );
  return (
    <StoreShell>
      <section className="page-intro">
        <Reveal>
          <span className="eyebrow">AUREN / Studio collection 01</span>
          <h1>
            Everyday,
            <br />
            <em>in your own way.</em>
          </h1>
          <p>Relaxed shapes. A considered palette. Build your uniform, one piece at a time.</p>
        </Reveal>
        <span className="collection-count">{CATALOG.length} PIECES / 05 LOOKS</span>
      </section>
      <section className="section-space shop-section">
        <div className="shop-toolbar">
          <div className="category-tabs" aria-label="Filter category">
            {CATEGORIES.map((c) => (
              <button key={c} aria-pressed={c === category} onClick={() => setCategory(c)}>
                {c === "All" ? "All pieces" : c === "Top" ? "Tops" : c === "Bottom" ? "Bottoms" : c}
              </button>
            ))}
          </div>
          <label className="sort-label">
            Sort{" "}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              <option value="edit">Studio edit</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
        <div className="shop-search">
          <Search size={16} />
          <input
            type="search"
            aria-label="Search products"
            placeholder="Find a piece, colour or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={16} />
            </button>
          )}
          <span aria-live="polite">{products.length} pieces</span>
        </div>
        {products.length ? (
          <div className="product-grid">
            {products.map((e, i) => (
              <Reveal key={e.product.id} delay={(i % 4) * 0.04}>
                <ProductCard entry={e} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No pieces found.</h2>
            <p>Try another colour or name, or explore the whole edit.</p>
            <button
              className="primary-button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Show all pieces
            </button>
          </div>
        )}
      </section>
    </StoreShell>
  );
}
