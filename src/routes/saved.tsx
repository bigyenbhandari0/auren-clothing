import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/auren/StoreShell";
import { ProductCard } from "@/components/auren/ProductCard";
import { useWardrobe } from "@/lib/wardrobe";
import { CATALOG } from "@/lib/catalog";
export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Your saved edit — AUREN" }] }),
  component: Saved,
});
function Saved() {
  const { saved } = useWardrobe();
  const entries = CATALOG.filter((e) => saved.includes(e.product.id));
  return (
    <>
      <section className="page-intro saved-intro">
        <Reveal>
          <span className="eyebrow">A wardrobe, considered</span>
          <h1>
            Your <em>saved edit.</em>
          </h1>
          <p>The pieces you come back to. Saved on this device, ready when you are.</p>
        </Reveal>
        <span className="collection-count">{entries.length} SAVED PIECES</span>
      </section>
      <section className="section-space">
        {entries.length ? (
          <div className="product-grid">
            {entries.map((e) => (
              <ProductCard key={e.product.id} entry={e} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Heart size={32} strokeWidth={1} />
            <h2>Make room for your favourites.</h2>
            <p>Tap the heart on any piece to keep it here.</p>
            <Link to="/shop" className="text-link">
              Explore the collection <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
