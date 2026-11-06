import { CATALOG, CATEGORIES } from "./catalog";
export type ShopSearch = {
  q?: string | undefined;
  category?: string | undefined;
  sort?: string | undefined;
  size?: string | undefined;
};
export function cleanShopSearch(raw: Record<string, unknown>): ShopSearch {
  return {
    ...(typeof raw["q"] === "string" && raw["q"].trim() ? { q: raw["q"].slice(0, 120) } : {}),
    ...(typeof raw["category"] === "string" &&
    CATEGORIES.includes(raw["category"] as (typeof CATEGORIES)[number])
      ? { category: raw["category"] }
      : {}),
    ...(raw["sort"] === "low" || raw["sort"] === "high" ? { sort: raw["sort"] } : {}),
    ...(typeof raw["size"] === "string" &&
    CATALOG.some((e) => e.product.sizes.includes(raw["size"] as string))
      ? { size: raw["size"] }
      : {}),
  };
}
export function filteredProducts({
  q = "",
  category = "All",
  sort = "edit",
  size = "",
}: ShopSearch) {
  return CATALOG.filter(
    ({ product: p }) =>
      (category === "All" || p.category === category) &&
      (!size || p.sizes.includes(size)) &&
      `${p.name} ${p.color} ${p.category}`.toLowerCase().includes(q.trim().toLowerCase()),
  ).sort((a, b) =>
    sort === "low"
      ? a.product.price - b.product.price
      : sort === "high"
        ? b.product.price - a.product.price
        : 0,
  );
}
