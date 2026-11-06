import { describe, it, expect } from "vitest";
import { cleanShopSearch, filteredProducts } from "./shop-filters";
import { restoreIds, rememberProduct } from "./wardrobe";
import { selectionText } from "./selection";
describe("shareable shop filters", () => {
  it("combines category search and size and sorts on catalogue prices", () => {
    const rows = filteredProducts({ category: "Top", q: "crew", size: "M", sort: "low" });
    expect(rows.map((e) => e.product.price)).toEqual([118, 124, 128]);
    expect(filteredProducts({ category: "Eyewear", size: "M" })).toHaveLength(0);
  });
  it("rejects unknown query values and bounds search length", () => {
    expect(cleanShopSearch({ category: "unknown", sort: "free", size: "999", q: 4 })).toEqual({});
    expect(cleanShopSearch({ q: "a".repeat(500) }).q).toHaveLength(120);
  });
});
describe("saved wardrobe", () => {
  it("only restores unique catalogue IDs", () =>
    expect(restoreIds(["p-rust-crew", "p-rust-crew", "missing", null])).toEqual(["p-rust-crew"]));
  it("moves recently viewed pieces to the front without duplicates", () =>
    expect(rememberProduct(["p-rust-crew", "p-grey-crew"], "p-grey-crew")).toEqual([
      "p-grey-crew",
      "p-rust-crew",
    ]));
});
it("exports the selected sizes quantities and correct subtotal", () => {
  const text = selectionText([
    {
      productId: "p-rust-crew",
      lookId: "look-1",
      name: "Heavy Loop Crew",
      color: "Rust",
      size: "M",
      price: 128,
      qty: 2,
    },
  ]);
  expect(text).toContain("Size M / Qty 2 / €256");
  expect(text).toContain("Subtotal: €256");
  expect(text).toContain("not a placed or paid order");
});

import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "./catalog";
import { productImage } from "./product-media";
it("has a standalone product asset for every catalogue entry", () => {
  for (const { product } of CATALOG) {
    const path = join(process.cwd(), "public", productImage(product.id));
    expect(existsSync(path), product.id).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(10000);
  }
});
