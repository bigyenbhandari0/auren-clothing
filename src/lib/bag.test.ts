import { describe, expect, it } from "vitest";
import { mergeItem, subtotal, type BagItem } from "./bag";

const base: BagItem = { productId: "p1", lookId: "l1", name: "Crew", color: "Rust", size: "M", price: 128, qty: 1 };

describe("bag", () => {
  it("merges same product and size into one line", () => {
    const r = mergeItem([base], { ...base });
    expect(r).toHaveLength(1);
    expect(r[0].qty).toBe(2);
  });
  it("keeps different sizes as separate lines", () => {
    expect(mergeItem([base], { ...base, size: "L" })).toHaveLength(2);
  });
  it("computes subtotal from price times quantity", () => {
    expect(subtotal([{ ...base, qty: 2 }, { ...base, productId: "p2", price: 50 }])).toBe(306);
  });
});
