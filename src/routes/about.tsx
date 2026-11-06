import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/auren/StoreShell";
import { Portrait } from "@/components/auren/Portrait";
import { LOOKS } from "@/lib/looks";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "Our studio — AUREN" }] }),
  component: About,
});
function About() {
  return (
    <>
      <section className="page-intro">
        <Reveal>
          <span className="eyebrow">AUREN / Our perspective</span>
          <h1>
            Clothes to live in.
            <br />
            <em>Space to be you.</em>
          </h1>
        </Reveal>
      </section>
      <section className="about-lineup" aria-label="The studio collection">
        <span className="about-lineup-label">STUDIO COLLECTION / 01</span>
        {LOOKS.map((l, i) => (
          <Reveal key={l.id} delay={i * 0.08}>
            <Portrait image={l.image} alt={l.name} className="about-portrait" framing="figure" />
          </Reveal>
        ))}
        <span className="about-lineup-caption">FIVE LOOKS / ONE PERSPECTIVE</span>
      </section>
      <section className="story-grid section-space">
        <span className="eyebrow">01 / The idea</span>
        <Reveal>
          <h2>
            An everyday wardrobe.
            <br />
            An independent spirit.
          </h2>
          <p>
            AUREN is a studio concept built around a simple idea: the best pieces leave room for the
            person wearing them. Relaxed proportions, understated colours and details that reward a
            closer look.
          </p>
          <p>
            Our first edit brings five complete looks together. Each is a starting point, never a
            set of rules. Wear a piece, change the proportions, make it yours.
          </p>
          <Link to="/shop" className="text-link">
            Discover the first edit <ArrowUpRight size={17} />
          </Link>
        </Reveal>
      </section>
      <section className="principle-grid section-space">
        {[
          [
            "01",
            "Proportion",
            "An easy silhouette, a different perspective. Clothes that move with your day.",
          ],
          [
            "02",
            "Versatility",
            "Pieces that work together, and work their own way. Build a wardrobe beyond a single look.",
          ],
          ["03", "Intention", "A considered palette and a focused edit. Every piece has a place."],
        ].map(([n, t, p]) => (
          <Reveal key={n}>
            <span className="eyebrow">{n} / Our approach</span>
            <h3>{t}</h3>
            <p>{p}</p>
          </Reveal>
        ))}
      </section>
    </>
  );
}
