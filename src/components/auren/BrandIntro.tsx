import { Portrait } from "./Portrait";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LOOKS } from "@/lib/looks";

const ease = [0.22, 1, 0.36, 1] as const;

/** Short, skippable entrance; the showroom stays mounted while images preload. */
export function BrandIntro({ onComplete }: { onComplete: () => void }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("auren-intro-seen")) setVisible(false);
    } catch { /* Session storage is optional. */ }
    const timer = window.setTimeout(() => setVisible(false), reduce ? 350 : 2900);
    return () => clearTimeout(timer);
  }, [reduce]);
  const finish = () => {
    try { sessionStorage.setItem("auren-intro-seen", "1"); } catch { /* optional */ }
    onComplete();
  };
  return (
    <AnimatePresence onExitComplete={finish}>
      {visible && (
        <motion.section
          key="intro"
          aria-label="Welcome to AUREN"
          className="brand-intro fixed inset-0 z-[100] flex flex-col overflow-hidden bg-background px-6 py-6 sm:px-10"
          initial={false}
          exit={{ opacity: 0, y: reduce ? 0 : "-4%" }}
          transition={{ duration: reduce ? 0.1 : 0.65, ease }}
        >
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em]">
            <span>AUREN / Studio collection</span>
            <button className="flex min-h-11 items-center gap-2" onClick={() => setVisible(false)}>
              Skip intro <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            <div className="flex overflow-hidden" aria-label="AUREN">
              {"AUREN".split("").map((letter, i) => (
                <motion.span key={i} aria-hidden className="text-[clamp(64px,17vw,220px)] font-medium leading-none tracking-[-0.07em] last:pr-[0.07em]"
                  initial={{ y: reduce ? 0 : "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.12 + i * 0.08, ease }}>
                  {letter}
                </motion.span>
              ))}
            </div>
            <div className="flex h-[clamp(110px,22svh,210px)] justify-center gap-2 sm:gap-4" aria-hidden>
              {LOOKS.map((look, i) => (
                <motion.div key={look.id} className="aspect-[0.3] overflow-hidden"
                  initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: reduce ? 0 : 0.55 + i * 0.07, ease }}>
                  <Portrait image={look.image} alt="" className="h-full w-full mix-blend-multiply" />
                </motion.div>
              ))}
            </div>
            <motion.p className="text-[10px] uppercase tracking-[0.3em]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 1.2 }}>
              Five looks. Your perspective.
            </motion.p>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            <span>Everyday forms / considered details</span><span>01 — 05</span>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
