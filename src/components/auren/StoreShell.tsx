import { BrandIntro } from "./BrandIntro";
import { useWardrobe } from "@/lib/wardrobe";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, useLocation, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Heart, Menu, Search, X } from "lucide-react";
import { useBag } from "@/lib/bag";
import { BagModal } from "./BagModal";
import { Toaster } from "@/components/ui/sonner";

const links = [
  { to: "/shop", label: "Shop all" },
  { to: "/", label: "Try the look" },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "Our studio" },
  { to: "/contact", label: "Contact" },
] as const;
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [belowFold, setBelowFold] = useState(false);
  useLayoutEffect(() => {
    setBelowFold(!reduce && (ref.current?.getBoundingClientRect().top ?? 0) >= window.innerHeight);
  }, [reduce]);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={belowFold ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function StoreShell({ children }: { children: ReactNode }) {
  const bag = useBag();
  const wardrobe = useWardrobe();
  const path = useLocation({ select: (l) => l.pathname });
  const [menu, setMenu] = useState(false);
  const navigating = useRouterState({ select: (state) => state.isLoading });
  const [showProgress, setShowProgress] = useState(false);
  useEffect(() => {
    if (!navigating) {
      setShowProgress(false);
      return;
    }
    const timer = window.setTimeout(() => setShowProgress(true), 180);
    return () => window.clearTimeout(timer);
  }, [navigating]);
  useEffect(() => {
    setMenu(false);
  }, [path]);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  return (
    <>
      {showProgress && (
        <div className="route-progress" role="status" aria-label="Opening page">
          <span />
        </div>
      )}
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        THE STUDIO EDIT / VOLUME 01 <span>Considered clothes. Everyday movement.</span>
      </div>
      <header className="store-header" data-store-header>
        <Link to="/" className="wordmark" aria-label="AUREN home">
          AUREN<span>STUDIO</span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={path === l.to ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            to="/saved"
            aria-label={`Saved pieces, ${wardrobe.saved.length} items`}
            className="saved-header"
          >
            <Heart size={17} />
            <span>{wardrobe.saved.length || ""}</span>
          </Link>
          <Link to="/shop" aria-label="Search the collection">
            <Search size={17} />
          </Link>
          <button onClick={() => bag.setOpen(true)} aria-label={`Shopping bag, ${bag.count} items`}>
            Bag <span className="bag-count">{bag.count}</span>
          </button>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.nav
            aria-label="Mobile navigation"
            className="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {links.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={l.to} onClick={() => setMenu(false)}>
                  <sup>0{i + 1}</sup>
                  {l.label}
                  <ArrowUpRight size={22} />
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <footer className="store-footer">
        <div>
          <Link to="/" className="footer-brand">
            AUREN
          </Link>
          <p>
            Clothes for the everyday.
            <br />A perspective of your own.
          </p>
        </div>
        <div>
          <span className="eyebrow">Explore</span>
          {links.slice(0, 4).map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </div>
        <div>
          <span className="eyebrow">Client care</span>
          <Link to="/care">Sizing & care</Link>
          <Link to="/care" hash="delivery">
            Delivery & returns
          </Link>
          <Link to="/contact">Contact the studio</Link>
          <Link to="/care" hash="privacy">
            Privacy
          </Link>
        </div>
        <div className="footer-note">
          <span className="eyebrow">An independent perspective</span>
          <p>
            Relaxed silhouettes.
            <br />
            Considered details.
            <br />
            Room to move.
          </p>
          <span>STUDIO COLLECTION — 01</span>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AUREN Studio</span>
          <span>
            Independent by design. <ArrowUpRight size={13} />
          </span>
        </div>
      </footer>
      <BagModal />
      <Toaster position="bottom-center" />
    </>
  );
}

const StudioEntrance = createContext(true);
export function useStudioEntrance() {
  return useContext(StudioEntrance);
}
/** Keep navigation, footer and dialogs mounted while only the outlet changes. */
export function StudioLayout({ children }: { children: ReactNode }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const [welcome] = useState(() => pathname === "/");
  const [entered, setEntered] = useState(() => pathname !== "/");
  const enter = useCallback(() => setEntered(true), []);
  return (
    <StudioEntrance.Provider value={entered}>
      {welcome && !entered && <BrandIntro onComplete={enter} />}
      <div inert={!entered} aria-hidden={!entered} data-store-shell>
        <StoreShell>{children}</StoreShell>
      </div>
    </StudioEntrance.Provider>
  );
}
