import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, X, Copy, Download, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useBag, subtotal } from "@/lib/bag";
import { LOOKS, formatPrice } from "@/lib/looks";
import { productImage } from "@/lib/product-media";
import { selectionText, downloadSelection } from "@/lib/selection";
export function BagModal() {
  const bag = useBag();
  const [copyStatus, setCopyStatus] = useState("");
  async function copy() {
    setCopyStatus("Copying your selection…");
    try {
      await copyText(selectionText(bag.items));
      setCopyStatus("Selection copied. Ready to paste into a message.");
      toast("Selection copied", { description: "Ready to paste into a message." });
    } catch {
      setCopyStatus("Copy is unavailable in this browser. Download your selection instead.");
      toast("Clipboard unavailable", {
        description: "Use Download selection to save your pieces instead.",
      });
    }
  }
  return (
    <Dialog open={bag.open} onOpenChange={bag.setOpen}>
      <DialogContent className="bag-drawer">
        <div className="bag-heading">
          <div>
            <span className="eyebrow">AUREN / Your edit</span>
            <DialogTitle>
              Your bag <span>({bag.count})</span>
            </DialogTitle>
          </div>
          <button onClick={() => bag.setOpen(false)} aria-label="Close bag">
            <X size={20} />
          </button>
        </div>
        <DialogDescription className="sr-only">
          Your selected pieces. Adjust quantities or save a selection summary.
        </DialogDescription>
        {bag.items.length ? (
          <>
            <ul className="bag-lines">
              {bag.items.map((it) => {
                const product = LOOKS.find((l) => l.id === it.lookId)?.products.find(
                  (p) => p.id === it.productId,
                );
                return (
                  <li key={`${it.productId}-${it.size}`}>
                    <Link
                      to="/products/$productId"
                      params={{ productId: it.productId }}
                      onClick={() => bag.setOpen(false)}
                    >
                      <img src={productImage(it.productId)} alt={product?.name ?? it.name} />
                    </Link>
                    <div className="bag-line-copy">
                      <Link
                        to="/products/$productId"
                        params={{ productId: it.productId }}
                        onClick={() => bag.setOpen(false)}
                      >
                        {it.name}
                      </Link>
                      <p>
                        {it.color} / Size {it.size}
                      </p>
                      <div className="bag-line-controls">
                        <div className="quantity-control">
                          <button
                            aria-label={`Decrease ${it.name}`}
                            onClick={() => bag.setQty(it.productId, it.size, it.qty - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span>{it.qty}</span>
                          <button
                            disabled={it.qty >= 99}
                            aria-label={`Increase ${it.name}`}
                            onClick={() => bag.setQty(it.productId, it.size, it.qty + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          className="remove-piece"
                          onClick={() => bag.remove(it.productId, it.size)}
                          aria-label={`Remove ${it.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <span className="bag-line-price">{formatPrice(it.price * it.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="bag-summary">
              <div>
                <span>Subtotal</span>
                <span data-testid="subtotal">{formatPrice(subtotal(bag.items))}</span>
              </div>
              <p>Ready when you are. Add delivery details and request cash on delivery.</p>
              <Link to="/checkout" className="primary-button" onClick={() => bag.setOpen(false)}>
                Continue to checkout <ArrowUpRight size={16} />
              </Link>
              <button className="secondary-button" onClick={copy}>
                Copy selection <Copy size={16} />
              </button>
              <button
                className="secondary-button"
                onClick={() => {
                  downloadSelection(selectionText(bag.items));
                  toast("Selection downloaded");
                }}
              >
                Download selection <Download size={16} />
              </button>
              {copyStatus && (
                <p className="copy-status" role="status">
                  {copyStatus}
                </p>
              )}
              <span className="bag-order-note">
                COD requests are sent through WhatsApp. Availability and delivery are confirmed by
                the studio.
              </span>
            </div>
          </>
        ) : (
          <div className="bag-empty">
            <span className="eyebrow">A fresh start</span>
            <h3>
              Your next
              <br />
              <em>everyday piece.</em>
            </h3>
            <p>Find something that feels like you.</p>
            <Link to="/shop" className="text-link" onClick={() => bag.setOpen(false)}>
              Explore the edit <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
