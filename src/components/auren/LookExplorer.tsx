import { productImage } from "@/lib/product-media";
import { Link } from "@tanstack/react-router";
import { Portrait, modelForImage } from "./Portrait";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { LOOKS, PORTRAIT_RATIO, formatPrice, type Look, type Product } from "@/lib/looks";
import { useBag, type BagItem } from "@/lib/bag";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.75;

function useStageSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      if (e) setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export function Thumb({
  image,
  product,
  className,
}: {
  image: string;
  product: Product;
  className?: string;
}) {
  return (
    <img
      src={productImage(product.id)}
      alt={`${product.name} in ${product.color}`}
      loading="lazy"
      decoding="async"
      width="1000"
      height="1000"
      className={cn("product-thumb h-16 w-14 shrink-0 object-contain", className)}
    />
  );
}

export function LookExplorer({ entered = true }: { entered?: boolean }) {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : DURATION;
  const [active, setActive] = useState(2);
  const previousActive = useRef(2);
  const [focused, setFocused] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [stageRef, stage] = useStageSize();
  const busy = useRef(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const bag = useBag();
  const look = LOOKS[active]!;

  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (lockTimer.current) clearTimeout(lockTimer.current);
    },
    [],
  );
  const lock = () => {
    busy.current = true;
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => (busy.current = false), dur * 1000);
  };

  const go = useCallback(
    (to: number) => {
      if (busy.current || focused) return;
      const n = (to + LOOKS.length) % LOOKS.length;
      if (n === active) return;
      lock();
      previousActive.current = active;
      setActive(n);
      setSelected(null);
      setError(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active, focused, dur],
  );

  useEffect(() => {
    if (!entered || !autoplay || focused || bag.open || reduce) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) go(active + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [entered, autoplay, focused, bag.open, reduce, go, active]);

  const openFocus = () => {
    if (busy.current) return;
    lock();
    setAutoplay(false);
    setFocused(true);
  };
  const closeFocus = () => {
    if (busy.current) return;
    lock();
    setSelected(null);
    setFocused(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (bag.open) return;
      const t = e.target as HTMLElement;
      if (t?.closest("input, textarea, select, [role=radiogroup], [contenteditable=true]")) return;
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
      if (!focused && e.key === "ArrowRight") go(active + 1);
      if (!focused && e.key === "ArrowLeft") go(active - 1);
      if (e.key === "Escape" && focused) {
        if (selected) setSelected(null);
        else closeFocus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Preload neighbours
  useEffect(() => {
    [active - 1, active + 1].forEach((i) => {
      if (LOOKS[i]) new Image().src = modelForImage(LOOKS[i].image).src;
    });
  }, [active]);

  useEffect(() => {
    if (error && selected) {
      document
        .getElementById(`piece-${selected}`)
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    }
  }, [error, selected, reduce]);

  const isMobile = stage.w > 0 && stage.w < 640;
  const ph = Math.max(0, stage.h - 44);
  const pw = ph * PORTRAIT_RATIO;
  const spacing = pw * (isMobile ? 1.3 : 1.18);

  const toItem = (p: Product, size: string): BagItem => ({
    productId: p.id,
    lookId: look.id,
    name: p.name,
    color: p.color,
    size,
    price: p.price,
    qty: 1,
  });
  const sizeOf = (p: Product) => (p.sizes.length === 1 ? p.sizes[0] : sizes[p.id]);

  const addPiece = (p: Product) => {
    const s = sizeOf(p);
    if (!s) {
      setSelected(p.id);
      setError(`Choose a size for ${p.name}.`);
      return;
    }
    setError(null);
    bag.add([toItem(p, s)]);
    toast(`${p.name} added to bag`, { description: `Size ${s}` });
  };

  const addLook = () => {
    const missing = look.products.filter((p) => !sizeOf(p));
    if (missing.length) {
      setSelected(missing[0]!.id);
      setError(`Choose a size for: ${missing.map((m) => m.name).join(", ")}.`);
      return;
    }
    setError(null);
    bag.add(look.products.map((p) => toItem(p, sizeOf(p)!)));
    toast(`${look.name} look added to bag`, { description: `${look.products.length} pieces` });
  };

  return (
    <main
      id="looks"
      className="look-explorer grid min-h-0 flex-1 grid-cols-1 gap-y-6 px-5 pb-6 lg:grid-cols-[76fr_24fr] lg:gap-x-10 lg:px-10"
    >
      <section className="flex min-w-0 flex-col" aria-label="Look explorer">
        <div className="h-20 lg:h-24">
          <AnimatePresence mode="wait" initial={false}>
            {focused ? (
              <motion.button
                key="back"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: dur * 0.5, ease: EASE }}
                onClick={closeFocus}
                className="mt-2 inline-flex items-center gap-2 text-sm text-foreground hover:opacity-60"
              >
                <ArrowLeft className="h-4 w-4" /> Back to looks
              </motion.button>
            ) : (
              <motion.div
                key="title"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: dur * 0.5, ease: EASE }}
              >
                <h1 className="text-3xl font-normal tracking-tight lg:text-[40px] lg:leading-tight">
                  Try the Look.
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Swipe through the studio. Select a model. Make it your own.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          ref={stageRef}
          className="relative h-[52svh] min-h-[300px] touch-pan-y select-none overflow-hidden lg:h-[calc(100svh-260px)] lg:min-h-[320px]"
          onPointerDown={(e) => {
            if (focused || e.button !== 0) return;
            drag.current = { x: e.clientX, moved: false };
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") drag.current = null;
          }}
          onPointerMove={(e) => {
            if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true;
          }}
          onPointerUp={(e) => {
            const d = drag.current;
            if (d && d.moved && !focused) {
              const dx = e.clientX - d.x;
              if (dx < -40) go(active + 1);
              else if (dx > 40) go(active - 1);
            }
          }}
        >
          {stage.w > 0 &&
            LOOKS.map((l, i) => {
              const isActive = i === active;
              const offset = ((i - active + LOOKS.length + 2) % LOOKS.length) - 2;
              const previousOffset =
                ((i - previousActive.current + LOOKS.length + 2) % LOOKS.length) - 2;
              const wrapping = !focused && Math.abs(offset - previousOffset) > 2;
              const x = stage.w / 2 - pw / 2 + offset * spacing;
              return (
                <motion.div
                  key={l.id}
                  className="absolute top-2 left-0"
                  style={{
                    width: pw,
                    height: ph,
                    zIndex: isActive ? 2 : 1,
                    transformOrigin: "50% 100%",
                  }}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{
                    x: focused && !isActive ? x + (offset < 0 ? -stage.w : stage.w) : x,
                    y: entered ? (isActive ? 0 : 18) : 100,
                    opacity:
                      wrapping && entered
                        ? [0, 0, 0.72]
                        : entered
                          ? focused && !isActive
                            ? 0
                            : isActive
                              ? 1
                              : 0.72
                          : 0,
                    scale: focused && isActive ? 1.045 : isActive ? 1 : 0.9,
                  }}
                  transition={{
                    x: { duration: wrapping ? 0 : dur, ease: EASE },
                    y: { duration: dur, ease: EASE, delay: entered ? i * 0.055 : 0 },
                    scale: { duration: dur, ease: EASE, delay: focused ? dur * 0.25 : 0 },
                    opacity: {
                      duration: wrapping ? dur : dur * 0.5,
                      ease: EASE,
                      ...(wrapping ? { times: [0, 0.65, 1] } : {}),
                      delay: wrapping || focused ? 0 : dur * 0.35,
                    },
                  }}
                >
                  <button
                    type="button"
                    tabIndex={focused && !isActive ? -1 : 0}
                    aria-label={
                      isActive
                        ? focused
                          ? `${l.name} look`
                          : `Open ${l.name} look`
                        : `Show ${l.name} look`
                    }
                    disabled={focused}
                    onClick={() => {
                      if (drag.current?.moved) return;
                      if (isActive) openFocus();
                      else go(i);
                    }}
                    className={cn(
                      "block h-full w-full",
                      !focused && "cursor-pointer",
                      focused && !isActive && "pointer-events-none",
                    )}
                  >
                    <Portrait
                      image={l.image}
                      alt={`Model wearing the ${l.name} look`}
                      className="h-full w-full mix-blend-multiply"
                    />
                  </button>
                  {isActive && (
                    <Hotspots
                      look={l}
                      visible={focused}
                      delay={dur}
                      selected={selected}
                      onSelect={setSelected}
                    />
                  )}
                </motion.div>
              );
            })}
        </div>

        <div
          className={cn(
            "mt-4 flex items-center justify-center gap-6 transition-opacity",
            focused && "pointer-events-none opacity-0",
          )}
        >
          <button
            onClick={() => go(active - 1)}
            disabled={focused}
            aria-label="Previous look"
            className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span
            className="min-w-14 text-center text-xs tabular-nums text-muted-foreground"
            aria-live="polite"
          >
            {String(active + 1).padStart(2, "0")} / {String(LOOKS.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => go(active + 1)}
            disabled={focused}
            aria-label="Next look"
            className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-foreground disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setAutoplay(!autoplay)}
            disabled={focused}
            aria-label={autoplay ? "Pause automatic looks" : "Play automatic looks"}
            className="grid h-10 w-10 place-items-center rounded-full border border-border disabled:opacity-30"
          >
            {autoplay ? <Pause size={13} /> : <Play size={13} />}
          </button>
        </div>
        <p className="look-caption">
          <span>
            0{active + 1} / {look.name}
          </span>
          <span>{focused ? "Explore the hotspots" : "Drag to explore · Click to discover"}</span>
        </p>
      </section>

      <OutfitRail
        look={look}
        selected={selected}
        onSelect={(id) => {
          setSelected((s) => (s === id ? null : id));
          setError(null);
        }}
        sizes={sizes}
        onSize={(id, s) => {
          setSizes((m) => ({ ...m, [id]: s }));
          setError(null);
        }}
        onAddPiece={addPiece}
        onAddLook={addLook}
        error={error}
      />
    </main>
  );
}

function Hotspots({
  look,
  visible,
  delay,
  selected,
  onSelect,
}: {
  look: Look;
  visible: boolean;
  delay: number;
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <AnimatePresence>
      {visible &&
        look.products.map((p, i) => {
          const on = selected === p.id;
          const left = p.hotspot.x > 55;
          return (
            <motion.div
              key={p.id}
              className="absolute"
              style={{ left: `${p.hotspot.x}%`, top: `${p.hotspot.y}%`, zIndex: on ? 5 : 3 }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { delay: delay + i * 0.06, duration: 0.3 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <button
                type="button"
                aria-label={`${p.name}, ${formatPrice(p.price)}`}
                aria-pressed={on}
                onClick={() => onSelect(on ? null : p.id)}
                onMouseEnter={() => onSelect(p.id)}
                onFocus={() => onSelect(p.id)}
                className="-translate-x-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full"
              >
                <span
                  className={cn(
                    "block h-3.5 w-3.5 rounded-full border-2 border-card bg-foreground shadow transition-transform",
                    on && "scale-125",
                  )}
                />
              </button>
              {on && (
                <div
                  role="tooltip"
                  className={cn(
                    "absolute top-0 -translate-y-1/2 w-max max-w-[150px] bg-card px-3 py-2 text-xs shadow-sm",
                    left ? "right-5" : "left-5",
                  )}
                >
                  <div className="font-medium">{p.name}</div>
                  <div className="text-muted-foreground">{formatPrice(p.price)}</div>
                </div>
              )}
            </motion.div>
          );
        })}
    </AnimatePresence>
  );
}

function OutfitRail({
  look,
  selected,
  onSelect,
  sizes,
  onSize,
  onAddPiece,
  onAddLook,
  error,
}: {
  look: Look;
  selected: string | null;
  onSelect: (id: string) => void;
  sizes: Record<string, string>;
  onSize: (id: string, s: string) => void;
  onAddPiece: (p: Product) => void;
  onAddLook: () => void;
  error: string | null;
}) {
  const total = look.products.reduce((s, p) => s + p.price, 0);
  return (
    <aside className="outfit-rail flex min-w-0 flex-col lg:pt-24" aria-label="Outfit pieces">
      <div className="flex items-baseline justify-between border-b border-border pb-3">
        <h2 className="text-sm font-medium">{look.name}</h2>
        <span className="text-xs text-muted-foreground">{look.products.length} pieces</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={look.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex-1"
        >
          {look.products.map((p, index) => {
            const on = selected === p.id;
            const size = p.sizes.length === 1 ? p.sizes[0] : sizes[p.id];
            return (
              <motion.li
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: index * 0.09, ease: EASE }}
                key={p.id}
                id={`piece-${p.id}`}
                className={cn(
                  "border-b border-border py-3 transition-colors",
                  on && "bg-secondary/70",
                )}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onSelect(p.id)}
                    aria-expanded={on}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <Thumb image={look.image} product={p} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">{p.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {p.category} · {p.color}
                        {size ? ` · ${size}` : ""}
                      </div>
                      <div className="mt-0.5 text-sm">{formatPrice(p.price)}</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddPiece(p)}
                    aria-label={`Add ${p.name} to bag`}
                    className="h-11 shrink-0 border border-foreground px-3 text-xs hover:bg-foreground hover:text-primary-foreground"
                  >
                    Add
                  </button>
                </div>
                {on && p.sizes.length > 1 && (
                  <div
                    className="mt-3 flex flex-wrap gap-1.5"
                    role="radiogroup"
                    aria-label={`Size for ${p.name}`}
                  >
                    {p.sizes.map((s) => (
                      <button
                        key={s}
                        role="radio"
                        aria-checked={size === s}
                        onClick={() => onSize(p.id, s)}
                        className={cn(
                          "h-11 min-w-11 border px-2 text-xs",
                          size === s
                            ? "border-foreground bg-foreground text-primary-foreground"
                            : "border-border hover:border-foreground",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <Link
                  to="/products/$productId"
                  params={{ productId: p.id }}
                  className="piece-detail-link"
                >
                  View piece <ArrowUpRight size={11} />
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </AnimatePresence>
      <div className="sticky bottom-0 mt-4 bg-background pt-2 pb-1">
        {error && (
          <p role="alert" className="mb-2 text-xs text-destructive">
            {error}
          </p>
        )}
        <button
          onClick={onAddLook}
          className="flex h-12 w-full items-center justify-between bg-primary px-4 text-sm text-primary-foreground hover:opacity-90"
        >
          <span>Add full look</span>
          <span>{formatPrice(total)}</span>
        </button>
      </div>
    </aside>
  );
}
