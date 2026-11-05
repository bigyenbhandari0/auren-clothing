import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useBag, subtotal } from "@/lib/bag";
import { LOOKS, formatPrice } from "@/lib/looks";
import { Thumb } from "./LookExplorer";

export function BagModal() {
  const bag = useBag();
  const [view, setView] = useState<"bag" | "enquiry" | "sent">("bag");

  const findProduct = (lookId: string, productId: string) => {
    const look = LOOKS.find((l) => l.id === lookId);
    return { look, product: look?.products.find((p) => p.id === productId) };
  };

  return (
    <Dialog
      open={bag.open}
      onOpenChange={(o) => {
        bag.setOpen(o);
        if (!o) setTimeout(() => setView("bag"), 200);
      }}
    >
      <DialogContent className="max-h-[88svh] w-[calc(100%-2rem)] max-w-md gap-0 overflow-y-auto border-0 bg-card p-0 shadow-xl [&>button]:hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <DialogTitle className="text-base font-normal">
            {view === "bag" ? "Your shopping bag" : "Enquiry"}
          </DialogTitle>
          <button onClick={() => bag.setOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center hover:opacity-60">
            <X className="h-4 w-4" />
          </button>
        </div>
        <DialogDescription className="sr-only">Review the pieces in your bag.</DialogDescription>

        {view === "bag" && (
          <>
            {bag.items.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">Your bag is empty.</p>
            ) : (
              <ul className="px-5">
                {bag.items.map((it) => {
                  const { look, product } = findProduct(it.lookId, it.productId);
                  return (
                    <li key={`${it.productId}-${it.size}`} className="flex gap-3 border-b border-border py-4">
                      {look && product && <Thumb image={look.image} product={product} className="h-20 w-16" />}
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2 text-sm">
                          <span className="truncate">{it.name}</span>
                          <span>{formatPrice(it.price * it.qty)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {it.color} · Size {it.size}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button
                              aria-label={`Decrease ${it.name}`}
                              onClick={() => bag.setQty(it.productId, it.size, it.qty - 1)}
                              className="grid h-8 w-8 place-items-center hover:bg-secondary"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs tabular-nums" aria-label="Quantity">
                              {it.qty}
                            </span>
                            <button
                              aria-label={`Increase ${it.name}`}
                              onClick={() => bag.setQty(it.productId, it.size, it.qty + 1)}
                              className="grid h-8 w-8 place-items-center hover:bg-secondary"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => bag.remove(it.productId, it.size)}
                            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="px-5 py-5">
              <div className="mb-4 flex justify-between text-sm">
                <span>Subtotal</span>
                <span data-testid="subtotal">{formatPrice(subtotal(bag.items))}</span>
              </div>
              <button
                disabled={bag.items.length === 0}
                onClick={() => setView("enquiry")}
                className="h-12 w-full bg-primary text-sm text-primary-foreground hover:opacity-90 disabled:opacity-40"
              >
                Continue with enquiry
              </button>
            </div>
          </>
        )}

        {view === "enquiry" && (
          <form
            className="space-y-3 px-5 py-5"
            onSubmit={(e) => {
              e.preventDefault();
              setView("sent");
            }}
          >
            <p className="bg-secondary px-3 py-2 text-xs text-muted-foreground">
              Demo enquiry — nothing is sent, ordered or charged.
            </p>
            <label className="block text-xs">
              Name
              <input required className="mt-1 h-10 w-full border border-input bg-card px-3 text-sm outline-none focus:border-foreground" />
            </label>
            <label className="block text-xs">
              Email
              <input required type="email" className="mt-1 h-10 w-full border border-input bg-card px-3 text-sm outline-none focus:border-foreground" />
            </label>
            <label className="block text-xs">
              Message
              <textarea rows={3} className="mt-1 w-full border border-input bg-card px-3 py-2 text-sm outline-none focus:border-foreground" />
            </label>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setView("bag")} className="h-12 flex-1 border border-foreground text-sm">
                Back
              </button>
              <button type="submit" className="h-12 flex-[2] bg-primary text-sm text-primary-foreground hover:opacity-90">
                Send demo enquiry
              </button>
            </div>
          </form>
        )}

        {view === "sent" && (
          <div className="px-5 py-10 text-center">
            <p className="text-sm">Thanks — this was a demo enquiry.</p>
            <p className="mt-1 text-xs text-muted-foreground">No message was sent and no order was placed.</p>
            <button onClick={() => bag.setOpen(false)} className="mt-6 h-11 w-full bg-primary text-sm text-primary-foreground">
              Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
