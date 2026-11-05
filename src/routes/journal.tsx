import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { StoreShell, Reveal } from "@/components/auren/StoreShell";
import { Portrait } from "@/components/auren/Portrait";
import { LOOKS } from "@/lib/looks";
export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Journal — AUREN" }] }),
  component: Journal,
});
function Journal() {
  return (
    <StoreShell>
      <section className="page-intro">
        <Reveal>
          <span className="eyebrow">Notes from the studio</span>
          <h1>
            A closer <em>look.</em>
          </h1>
          <p>On proportion, colour and the way we wear the everyday.</p>
        </Reveal>
      </section>
      <div className="journal-list section-space">
        {[
          {
            look: LOOKS[0]!,
            title: "A study in warm and cool",
            text: "Rust against charcoal. A soft, warm crew grounded by a dark, wide trouser. Keep the palette focused and let the difference in texture do the work.",
            note: "COLOUR / 01",
          },
          {
            look: LOOKS[3]!,
            title: "Room for a different shape",
            text: "The wide leg changes everything. Pair it with a boxy white tee for an easy balance of volume. A clean shoe keeps the silhouette grounded.",
            note: "PROPORTION / 02",
          },
          {
            look: LOOKS[4]!,
            title: "The everyday uniform, reconsidered",
            text: "A dark collar. A pale jean. A familiar combination with a little more room to move. Wear it open, layer it lightly, make it part of your day.",
            note: "STYLING / 03",
          },
        ].map(({ look, title, text, note }, i) => (
          <Reveal key={look.id} className="journal-story">
            <div className="journal-photo">
              <Portrait image={look.image} alt={look.name} className="journal-portrait" />
            </div>
            <div>
              <span className="eyebrow">{note} / STUDIO NOTES</span>
              <h2>{title}</h2>
              <p>{text}</p>
              <Link
                to="/products/$productId"
                params={{ productId: look.products[0]!.id }}
                className="text-link"
              >
                Explore the piece <ArrowUpRight size={17} />
              </Link>
              <span className="story-number">0{i + 1}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </StoreShell>
  );
}
