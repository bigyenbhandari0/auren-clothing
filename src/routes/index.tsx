import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LookExplorer } from "@/components/auren/LookExplorer";
import { Portrait } from "@/components/auren/Portrait";
import { Reveal, useStudioEntrance } from "@/components/auren/StoreShell";
import { ProductCard } from "@/components/auren/ProductCard";
import { CATALOG } from "@/lib/catalog";
import { LOOKS } from "@/lib/looks";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AUREN — A perspective of your own" },
      {
        name: "description",
        content:
          "Explore the AUREN studio collection. Five looks, considered pieces and your own way to wear them.",
      },
    ],
  }),
  component: Index,
});
function Index() {
  const entered = useStudioEntrance();
  return (
    <>
      <>
        <div className="showroom-kicker">
          <span>THE INTERACTIVE WARDROBE / 01</span>
          <a href="#edit">
            Discover the collection <ArrowDown size={13} />
          </a>
        </div>
        <LookExplorer entered={entered} />
        <div className="ticker" aria-hidden>
          <div>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i}>
                A PERSPECTIVE OF YOUR OWN <i>↗</i> MADE FOR EVERYDAY MOVEMENT <i>↗</i>
              </span>
            ))}
          </div>
        </div>
        <section id="edit" className="section-space">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">01 / The studio edit</span>
              <h2>
                Good pieces.
                <br />
                <em>Endless possibilities.</em>
              </h2>
            </div>
            <Link to="/shop" className="text-link">
              Explore all pieces <ArrowUpRight size={17} />
            </Link>
          </Reveal>
          <div className="product-grid">
            {[CATALOG[0]!, CATALOG[4]!, CATALOG[9]!, CATALOG[13]!].map((e, i) => (
              <Reveal key={e.product.id} delay={i * 0.08}>
                <ProductCard entry={e} />
              </Reveal>
            ))}
          </div>
        </section>
        <section className="editorial-split">
          <Reveal className="editorial-image">
            <Portrait
              image={LOOKS[4]!.image}
              alt="Night Collar studio look"
              className="editorial-model"
            />
            <span>THE EVERYDAY UNIFORM / NO. 05</span>
          </Reveal>
          <Reveal className="editorial-copy">
            <span className="eyebrow">02 / A way of wearing</span>
            <h2>
              Less noise.
              <br />
              <em>More you.</em>
            </h2>
            <p>
              Start with a silhouette. Add a little contrast. Find the pieces that feel like you,
              then make them part of your everyday.
            </p>
            <Link to="/journal" className="text-link">
              Inside the studio <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </section>
        <section className="manifesto section-space">
          <Reveal>
            <span className="eyebrow">AUREN / An independent perspective</span>
            <h2>
              Not an occasion.
              <br />A way of <em>being.</em>
            </h2>
            <Link to="/about" className="text-link">
              Meet AUREN <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </section>
      </>
    </>
  );
}
