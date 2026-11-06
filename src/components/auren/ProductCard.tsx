import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/looks";
import { CATALOG } from "@/lib/catalog";
import { productImage } from "@/lib/product-media";
import { useWardrobe } from "@/lib/wardrobe";
import { useBag } from "@/lib/bag";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export function ProductCard({ entry }: { entry: (typeof CATALOG)[number] }) {
  const { product: p, look } = entry;
  const wardrobe = useWardrobe();
  const bag = useBag();
  const [quick, setQuick] = useState(false);
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [error, setError] = useState(false);
  const saved = wardrobe.saved.includes(p.id);
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
    setQuick(false);
    toast(`${p.name} added to bag`, {
      action: { label: "View bag", onClick: () => bag.setOpen(true) },
    });
  }
  return (
    <article className="product-card">
      <div className="product-card-image">
        <Link
          to="/products/$productId"
          params={{ productId: p.id }}
          aria-label={`View ${p.name} in ${p.color}`}
          className="product-image-link"
        >
          <img
            src={productImage(p.id)}
            alt={`${p.name} in ${p.color} — standalone studio product photograph`}
            loading="lazy"
            decoding="async"
            width="1000"
            height="1000"
            className="standalone-card-image"
          />
        </Link>
        <span className="product-card-index">{p.category} / Studio 01</span>
        <button
          className="save-piece"
          aria-label={`${saved ? "Unsave" : "Save"} ${p.name}`}
          aria-pressed={saved}
          onClick={() => wardrobe.toggle(p.id)}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
        <button
          className="quick-add"
          onClick={() => {
            setQuick(true);
            setError(false);
          }}
          aria-label={`Quick add ${p.name}`}
        >
          <span>Quick add</span>
          <Plus size={15} />
        </button>
      </div>
      <div className="card-caption">
        <div>
          <Link to="/products/$productId" params={{ productId: p.id }}>
            <h3>{p.name}</h3>
          </Link>
          <p>
            <span
              className={`colour-dot colour-${p.category === "Shoes" ? "shoe" : p.id.replace("p-", "")}`}
            />
            {p.color}
          </p>
        </div>
        <span>{formatPrice(p.price)}</span>
      </div>
      <Dialog open={quick} onOpenChange={setQuick}>
        <DialogContent className="quick-dialog">
          <DialogTitle>{p.name}</DialogTitle>
          <DialogDescription>
            {p.color} · {formatPrice(p.price)}
          </DialogDescription>
          <img className="quick-image" src={productImage(p.id)} alt={p.name} />
          <div
            role="radiogroup"
            aria-label={`Quick-add size for ${p.name}`}
            className="product-sizes"
          >
            {p.sizes.map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={size === s}
                onClick={() => {
                  setSize(s);
                  setError(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {error && (
            <p role="alert" className="size-error">
              Select your size.
            </p>
          )}
          <button className="primary-button" onClick={add}>
            Add to bag <Plus size={16} />
          </button>
          <Link className="text-link" to="/products/$productId" params={{ productId: p.id }}>
            Discover the piece <ArrowUpRight size={14} />
          </Link>
        </DialogContent>
      </Dialog>
    </article>
  );
}
