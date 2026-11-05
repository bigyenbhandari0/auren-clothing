import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { CATALOG, productDetails } from "@/lib/catalog";
import { formatPrice } from "@/lib/looks";
import { useBag } from "@/lib/bag";
import { Portrait } from "@/components/auren/Portrait";
import { Thumb } from "@/components/auren/LookExplorer";
import { ProductCard } from "@/components/auren/ProductCard";
import { StoreShell, Reveal } from "@/components/auren/StoreShell";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const entry = CATALOG.find((e) => e.product.id === params.productId);
    if (!entry) throw notFound();
    return entry;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name ?? "Product"} — AUREN` },
      {
        name: "description",
        content: `Discover ${loaderData?.product.name} in ${loaderData?.product.color}. Part of the AUREN studio collection.`,
      },
    ],
  }),
  component: ProductRoute,
});
function ProductRoute() {
  const entry = Route.useLoaderData();
  return <ProductPage key={entry.product.id} entry={entry} />;
}
function ProductPage({ entry }: { entry: (typeof CATALOG)[number] }) {
  const { product: p, look } = entry;
  const bag = useBag();
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [error, setError] = useState(false);
  const [view, setView] = useState("look");
  const [guide, setGuide] = useState(false);
  const [added, setAdded] = useState(false);
  const details = productDetails(p.category);
  const related = CATALOG.filter((e) => e.look.id === look.id && e.product.id !== p.id).slice(0, 3);
  function add() {
    if (!size) {
      setError(true);
      return;
    }
    bag.add([
      {
        productId: p.id,
        lookId: look.id,
        name: p.name,
        color: p.color,
        price: p.price,
        size,
        qty: 1,
      },
    ]);
    setAdded(true);
    toast(`${p.name} added to bag`, {
      action: { label: "View bag", onClick: () => bag.setOpen(true) },
    });
  }
  return (
    <StoreShell>
      <div className="breadcrumb">
        <Link to="/shop">
          <ArrowLeft size={13} /> Collection
        </Link>
        <span>
          / {p.category} / {p.name}
        </span>
      </div>
      <section className="product-layout">
        <div className="product-gallery">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              className="gallery-image"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === "detail" ? (
                <Thumb image={look.image} product={p} className="product-detail-image" />
              ) : (
                <Portrait
                  image={look.image}
                  alt={`Full ${look.name} outfit featuring ${p.name}`}
                  className="product-model-image"
                />
              )}
            </motion.div>
          </AnimatePresence>
          <span className="gallery-label">
            AUREN STUDIO / {view === "detail" ? "THE PIECE" : "THE SILHOUETTE"}
          </span>
          <div className="gallery-controls">
            <button aria-pressed={view === "detail"} onClick={() => setView("detail")}>
              01 / Detail
            </button>
            <button aria-pressed={view === "look"} onClick={() => setView("look")}>
              02 / Full look
            </button>
          </div>
        </div>
        <Reveal className="product-information">
          <span className="eyebrow">Studio collection / {p.category}</span>
          <h1>{p.name}</h1>
          <div className="product-price">
            {formatPrice(p.price)}
            <span>{p.color}</span>
          </div>
          <p className="product-description">
            An everyday essential from the {look.name} edit. A relaxed approach to proportion, easy
            to layer and entirely your own.
          </p>
          <div className="size-heading">
            <span>Select size {size && `— ${size}`}</span>
            <button onClick={() => setGuide(true)}>Size guide ↗</button>
          </div>
          <div role="radiogroup" aria-label="Choose your size" className="product-sizes">
            {p.sizes.map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={size === s}
                onClick={() => {
                  setSize(s);
                  setError(false);
                  setAdded(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {error && (
            <p role="alert" className="size-error">
              Select a size before adding this piece.
            </p>
          )}
          <button className="primary-button add-product" onClick={add}>
            <span>{added ? "Added to your bag" : "Add to bag"}</span>
            <span>{added ? <Check size={18} /> : <Plus size={18} />}</span>
          </button>
          {added && (
            <button className="view-bag-link" onClick={() => bag.setOpen(true)}>
              View your bag <ArrowUpRight size={15} />
            </button>
          )}
          <p className="product-disclaimer">Studio demo · no payment is taken.</p>
          <div className="product-accordions">
            {[
              { title: "Fit & silhouette", body: details.fit },
              {
                title: "Materials & care",
                body: `${details.material}. ${details.care} Material descriptions are illustrative for this concept collection.`,
              },
              {
                title: "Delivery & returns",
                body: "This is a concept storefront. Orders and delivery are not active. Contact the studio with questions about any piece.",
              },
            ].map((d, i) => (
              <details key={d.title} open={i === 0}>
                <summary>
                  {d.title}
                  <Plus size={14} className="details-plus" />
                  <Minus size={14} className="details-minus" />
                </summary>
                <p>{d.body}</p>
              </details>
            ))}
          </div>
          <Link to="/" hash="looks" className="text-link">
            Explore the complete look <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </section>
      <section className="section-space">
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">Wear it together</span>
            <h2>
              Complete <em>the look.</em>
            </h2>
          </div>
          <span>
            {look.name} / 0{Number(look.id.slice(-1))}
          </span>
        </Reveal>
        <div className="product-grid related-grid">
          {related.map((e) => (
            <Reveal key={e.product.id}>
              <ProductCard entry={e} />
            </Reveal>
          ))}
        </div>
      </section>
      <Dialog open={guide} onOpenChange={setGuide}>
        <DialogContent>
          <DialogTitle>Find your fit</DialogTitle>
          <DialogDescription>
            Use your usual{" "}
            {p.category === "Shoes"
              ? "European shoe"
              : p.category === "Bottom"
                ? "waist"
                : "clothing"}{" "}
            size as a starting point.
          </DialogDescription>
          <p className="text-sm leading-relaxed">
            {details.fit} Measurements are not available for this demo collection.
          </p>
          <Link to="/care" className="text-link" onClick={() => setGuide(false)}>
            Read the sizing guide <ArrowUpRight size={15} />
          </Link>
        </DialogContent>
      </Dialog>
    </StoreShell>
  );
}
