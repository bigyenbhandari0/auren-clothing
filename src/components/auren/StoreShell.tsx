import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function StoreShell({ children }: { children: ReactNode }) {
  const bag = useBag();
  const path = useLocation({ select: (l) => l.pathname });
  const [menu, setMenu] = useState(false);
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
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        THE STUDIO EDIT / VOLUME 01 <span>Considered clothes. Everyday movement.</span>
      </div>
      <header className="store-header">
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
        <motion.div
          key={path}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
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
