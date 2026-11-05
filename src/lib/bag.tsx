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

/** Merge an item into the bag; same product + size increments quantity. */
export function mergeItem(items: BagItem[], item: BagItem): BagItem[] {
  const i = items.findIndex((x) => x.productId === item.productId && x.size === item.size);
  if (i === -1) return [...items, item];
  return items.map((x, j) => (j === i ? { ...x, qty: x.qty + item.qty } : x));
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
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
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
            : cur.map((x) => (x.productId === id && x.size === size ? { ...x, qty } : x)),
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
