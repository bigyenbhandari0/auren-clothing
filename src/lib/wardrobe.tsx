import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { CATALOG } from "./catalog";
const VALID = new Set(CATALOG.map((e) => e.product.id));
export function restoreIds(raw: unknown) {
  return Array.isArray(raw)
    ? [...new Set(raw.filter((id): id is string => typeof id === "string" && VALID.has(id)))]
    : [];
}
export function rememberProduct(ids: string[], id: string) {
  return VALID.has(id) ? [id, ...ids.filter((x) => x !== id)].slice(0, 8) : ids;
}
const Context = createContext<{
  saved: string[];
  recent: string[];
  ready: boolean;
  toggle: (id: string) => void;
  remember: (id: string) => void;
} | null>(null);
export function WardrobeProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      setSaved(restoreIds(JSON.parse(localStorage.getItem("auren-saved") ?? "[]")));
      setRecent(restoreIds(JSON.parse(localStorage.getItem("auren-recent") ?? "[]")));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("auren-saved", JSON.stringify(saved));
        localStorage.setItem("auren-recent", JSON.stringify(recent));
      } catch {}
  }, [saved, recent, ready]);
  return (
    <Context.Provider
      value={{
        saved,
        recent,
        ready,
        toggle: (id) => {
          if (VALID.has(id))
            setSaved((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
        },
        remember: (id) => setRecent((ids) => rememberProduct(ids, id)),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useWardrobe() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing wardrobe provider");
  return value;
}
