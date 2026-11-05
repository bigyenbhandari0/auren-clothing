import { LOOKS } from "./looks";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface BagItem {
  productId: string;
  lookId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  qty: number;
}

const KEY = "auren-bag-v1";

/** Restore only valid catalogue items; stored prices and quantities are untrusted. */
export function restoreBag(raw: unknown): BagItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.reduce<BagItem[]>((items, entry) => {
    if (!entry || typeof entry !== "object") return items;
    const look = LOOKS.find((l) => l.id === entry.lookId);
    const product = look?.products.find((p) => p.id === entry.productId);
    if (!look || !product || !product.sizes.includes(entry.size) ||
        !Number.isInteger(entry.qty) || entry.qty < 1) return items;
    return mergeItem(items, {
      lookId: look.id, productId: product.id, name: product.name, color: product.color,
      price: product.price, size: entry.size, qty: Math.min(99, entry.qty),
    });
  }, []);
}

/** Merge an item into the bag; same product + size increments quantity. */
export function mergeItem(items: BagItem[], item: BagItem): BagItem[] {
  const i = items.findIndex((x) => x.productId === item.productId && x.size === item.size);
  if (i === -1) return [...items, item];
  return items.map((x, j) => (j === i ? { ...x, qty: Math.min(99, x.qty + item.qty) } : x));
}

export const subtotal = (items: BagItem[]) => items.reduce((s, x) => s + x.price * x.qty, 0);

interface BagCtx {
  items: BagItem[];
  count: number;
  add: (items: BagItem[]) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  remove: (productId: string, size: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
}

const Ctx = createContext<BagCtx | null>(null);

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(restoreBag(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* The bag still works when storage is unavailable. */ }
    }
  }, [items, ready]);

  const value = useMemo<BagCtx>(
    () => ({
      items,
      count: items.reduce((s, x) => s + x.qty, 0),
      add: (add) => setItems((cur) => add.reduce(mergeItem, cur)),
      setQty: (id, size, qty) =>
        setItems((cur) =>
          qty < 1
            ? cur.filter((x) => !(x.productId === id && x.size === size))
            : cur.map((x) => (x.productId === id && x.size === size ? { ...x, qty: Math.min(99, Math.max(1, Math.floor(qty))) } : x)),
        ),
      remove: (id, size) => setItems((cur) => cur.filter((x) => !(x.productId === id && x.size === size))),
      open,
      setOpen,
    }),
    [items, open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBag() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBag outside BagProvider");
  return c;
}
