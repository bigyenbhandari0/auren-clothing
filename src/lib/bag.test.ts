import { describe, expect, it } from "vitest";
import { mergeItem, restoreBag, subtotal, type BagItem } from "./bag";

const base: BagItem = { productId: "p1", lookId: "l1", name: "Crew", color: "Rust", size: "M", price: 128, qty: 1 };

describe("bag", () => {
  it("merges same product and size into one line", () => {
    const r = mergeItem([base], { ...base });
    expect(r).toHaveLength(1);
    expect(r[0]!.qty).toBe(2);
  });
  it("keeps different sizes as separate lines", () => {
    expect(mergeItem([base], { ...base, size: "L" })).toHaveLength(2);
  });
  it("computes subtotal from price times quantity", () => {
    expect(subtotal([{ ...base, qty: 2 }, { ...base, productId: "p2", price: 50 }])).toBe(306);
  });
});


describe("saved bag recovery", () => {
  it("ignores malformed storage and unknown products", () => {
    expect(restoreBag({ qty: 1 })).toEqual([]);
    expect(restoreBag([null, {}, { ...base }])).toEqual([]);
  });
  it("restores catalogue prices and clamps quantities", () => {
    const restored = restoreBag([{ ...base, lookId: "look-1", productId: "p-rust-crew", price: 0, qty: 1000 }]);
    expect(restored[0]).toMatchObject({ price: 128, qty: 99, name: "Heavy Loop Crew" });
  });
  it("rejects invalid sizes and quantities", () => {
    expect(restoreBag([{ ...base, lookId: "look-1", productId: "p-rust-crew", size: "invalid" }])).toEqual([]);
    expect(restoreBag([{ ...base, lookId: "look-1", productId: "p-rust-crew", qty: -2 }])).toEqual([]);
  });
});
