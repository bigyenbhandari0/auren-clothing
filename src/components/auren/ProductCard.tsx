import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Thumb } from "./LookExplorer";
import { formatPrice } from "@/lib/looks";
import { CATALOG } from "@/lib/catalog";
export function ProductCard({ entry }: { entry: (typeof CATALOG)[number] }) {
  const { product: p, look } = entry;
  return (
    <Link to="/products/$productId" params={{ productId: p.id }} className="product-card">
      <div className="product-card-image">
        <Thumb image={look.image} product={p} className="catalog-image" />
        <span className="product-card-index">{p.category} / Studio 01</span>
        <span className="card-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="card-caption">
        <div>
          <h3>{p.name}</h3>
          <p>{p.color}</p>
        </div>
        <span>{formatPrice(p.price)}</span>
      </div>
    </Link>
  );
}
