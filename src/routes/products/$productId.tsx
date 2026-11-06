import { copyText } from "@/lib/clipboard";
import { useWardrobe } from "@/lib/wardrobe";
import { productImage } from "@/lib/product-media";
import { useEffect, useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Plus,
  Minus,
  Heart,
  Maximize2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { CATALOG, productDetails } from "@/lib/catalog";
import { formatPrice } from "@/lib/looks";
import { useBag } from "@/lib/bag";
import { Portrait } from "@/components/auren/Portrait";
import { Thumb } from "@/components/auren/LookExplorer";
import { ProductCard } from "@/components/auren/ProductCard";
import { Reveal } from "@/components/auren/StoreShell";
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
  const wardrobe = useWardrobe();
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    if (wardrobe.ready) wardrobe.remember(p.id);
  }, [p.id, wardrobe.ready]);
  const recent = wardrobe.recent
    .filter((id) => id !== p.id)
    .map((id) => CATALOG.find((e) => e.product.id === id))
    .filter((e): e is (typeof CATALOG)[number] => !!e)
    .slice(0, 4);
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [error, setError] = useState(false);
  const [view, setView] = useState("detail");
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
        qty: quantity,
      },
    ]);
    setAdded(true);
    toast(`${p.name} added to bag`, {
      action: { label: "View bag", onClick: () => bag.setOpen(true) },
    });
  }
  return (
    <>
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
          <button
            className="gallery-zoom"
            onClick={() => setZoom(true)}
            aria-label={`Enlarge ${p.name} product photograph`}
          >
            <Maximize2 size={18} />
          </button>
          <span className="gallery-label">
            AUREN STUDIO / {view === "detail" ? "THE PIECE" : "THE SILHOUETTE"}
          </span>
          <div className="gallery-controls">
            <button aria-pressed={view === "detail"} onClick={() => setView("detail")}>
              01 / The piece
            </button>
            <button aria-pressed={view === "look"} onClick={() => setView("look")}>
              02 / Styled look
            </button>
          </div>
        </div>
        <Reveal className="product-information">
          <span className="eyebrow">Studio collection / {p.category}</span>
          <div className="product-title-row">
            <h1>{p.name}</h1>
            <button
              className="product-save"
              aria-label={`${wardrobe.saved.includes(p.id) ? "Unsave" : "Save"} ${p.name}`}
              aria-pressed={wardrobe.saved.includes(p.id)}
              onClick={() => wardrobe.toggle(p.id)}
            >
              <Heart
                size={22}
                strokeWidth={1.3}
                fill={wardrobe.saved.includes(p.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
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
          <div className="purchase-controls">
            <div className="quantity-control" aria-label="Product quantity">
              <button
                aria-label="Decrease quantity"
                disabled={quantity === 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={13} />
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                aria-label="Increase quantity"
                disabled={quantity === 99}
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              >
                <Plus size={13} />
              </button>
            </div>
            <button className="primary-button add-product" onClick={add}>
              <span>{added ? "Added to your bag" : "Add to bag"}</span>
              <span>{added ? <Check size={18} /> : <Plus size={18} />}</span>
            </button>
          </div>
          <button
            className="share-product"
            onClick={async () => {
              try {
                await copyText(window.location.href);
                toast("Product link copied");
              } catch {
                toast("Copy this page address from your browser");
              }
            }}
          >
            <Share2 size={13} /> Share this piece
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
      {recent.length > 0 && (
        <section className="section-space recently-viewed">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Back on your radar</span>
              <h2>
                Recently <em>viewed.</em>
              </h2>
            </div>
          </div>
          <div className="product-grid">
            {recent.map((e) => (
              <ProductCard key={e.product.id} entry={e} />
            ))}
          </div>
        </section>
      )}
      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="image-lightbox">
          <DialogTitle className="sr-only">{p.name} — product photograph</DialogTitle>
          <DialogDescription className="sr-only">
            Full standalone product image. Pinch to zoom on touch devices.
          </DialogDescription>
          <img src={productImage(p.id)} alt={`${p.name} in ${p.color}, full product photograph`} />
        </DialogContent>
      </Dialog>
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
    </>
  );
}
