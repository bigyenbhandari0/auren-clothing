import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, Copy, Download, MessageCircle } from "lucide-react";
import { useBag, subtotal } from "@/lib/bag";
import { formatPrice } from "@/lib/looks";
import { productImage } from "@/lib/product-media";
import { copyText } from "@/lib/clipboard";
import { downloadSelection } from "@/lib/selection";
import { orderMessage, whatsappUrl, INSTAGRAM_URL } from "@/lib/ordering";
export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — AUREN" }] }),
  component: Checkout,
});
function Checkout() {
  const bag = useBag();
  const [request, setRequest] = useState<{ text: string; reference: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [delivery, setDelivery] = useState<Record<string, string>>({});
  useEffect(() => {
    setRequest(null);
    setCopied(false);
  }, [bag.items]);
  if (!bag.items.length && !request)
    return (
      <section className="page-intro checkout-empty">
        <span className="eyebrow">AUREN / Checkout</span>
        <h1>
          Your next <em>everyday piece.</em>
        </h1>
        <p>Add a piece to your bag to begin.</p>
        <Link to="/shop" className="text-link">
          Explore the collection <ArrowUpRight size={16} />
        </Link>
      </section>
    );
  return (
    <>
      <section className="page-intro checkout-intro">
        <span className="eyebrow">AUREN / Your final edit</span>
        <h1>
          A few final <em>details.</em>
        </h1>
        <p>Cash on delivery. Personal confirmation from our studio.</p>
      </section>
      <section className="checkout-layout section-space">
        {request ? (
          <div className="checkout-handoff" role="status">
            <Check size={28} />
            <span className="eyebrow">REQUEST {request.reference}</span>
            <h2>Ready to send.</h2>
            <p>
              Your order request is prepared. Open WhatsApp and tap Send to share it with our
              studio. We will confirm stock, delivery charges and the final amount before dispatch.
            </p>
            <pre className="checkout-request">{request.text}</pre>
            <a
              className="primary-button"
              href={whatsappUrl(request.text)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Send COD request on WhatsApp <MessageCircle size={18} />
            </a>
            <p className="checkout-disclosure">
              Opening WhatsApp does not submit the order automatically. Your bag stays available
              until you choose to remove its items.
            </p>
            <button
              className="secondary-button"
              onClick={async () => {
                try {
                  await copyText(request.text);
                  setCopied(true);
                } catch {
                  downloadSelection(request.text, "auren-cod-request.txt");
                }
              }}
            >
              {copied ? "Order details copied" : "Copy order details"} <Copy size={16} />
            </button>
            <button
              className="text-link"
              onClick={() => downloadSelection(request.text, "auren-cod-request.txt")}
            >
              Save a copy <Download size={16} />
            </button>
            <button
              className="text-link"
              onClick={() => {
                setRequest(null);
                setCopied(false);
              }}
            >
              Edit delivery details ↗
            </button>
            <a className="text-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Ask us on Instagram ↗
            </a>
            <p>For Instagram orders, copy the order details above and paste them into a DM.</p>
          </div>
        ) : (
          <form
            className="contact-form checkout-form"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const get = (key: string) => String(data.get(key) ?? "").trim();
              setDelivery(
                Object.fromEntries(
                  ["name", "phone", "city", "address", "landmark", "note"].map((key) => [
                    key,
                    get(key),
                  ]),
                ),
              );
              const reference = `AR-${(Date.now().toString(36) + Math.random().toString(36).slice(2, 6)).toUpperCase()}`;
              setRequest({
                reference,
                text: orderMessage(
                  bag.items,
                  {
                    name: get("name"),
                    phone: get("phone"),
                    city: get("city"),
                    address: get("address"),
                    landmark: get("landmark"),
                    note: get("note"),
                  },
                  reference,
                ),
              });
            }}
          >
            <div>
              <span className="eyebrow">01 / Delivery details</span>
              <h2>Where should it go?</h2>
            </div>
            <label>
              Full name
              <input
                name="name"
                defaultValue={delivery["name"] ?? ""}
                autoComplete="name"
                required
                maxLength={100}
                pattern=".*\S.*"
              />
            </label>
            <label>
              Mobile number
              <input
                name="phone"
                defaultValue={delivery["phone"] ?? ""}
                type="tel"
                autoComplete="tel"
                required
                pattern="[+]?[0-9 ]{7,20}"
                maxLength={20}
                placeholder="98XXXXXXXX"
              />
            </label>
            <label>
              City / district
              <input
                name="city"
                defaultValue={delivery["city"] ?? ""}
                autoComplete="address-level2"
                required
                maxLength={100}
                pattern=".*\S.*"
              />
            </label>
            <label>
              Street, area and house details
              <textarea
                name="address"
                defaultValue={delivery["address"] ?? ""}
                autoComplete="street-address"
                required
                rows={3}
                maxLength={500}
              />
            </label>
            <label>
              Nearby landmark (optional)
              <input name="landmark" defaultValue={delivery["landmark"] ?? ""} maxLength={150} />
            </label>
            <label>
              Order note (optional)
              <textarea
                name="note"
                defaultValue={delivery["note"] ?? ""}
                rows={3}
                maxLength={500}
              />
            </label>
            <div className="checkout-payment">
              <span className="eyebrow">02 / Payment</span>
              <h3>Cash on delivery</h3>
              <p>
                Pay when your confirmed order arrives. No online payment is taken. Delivery fees and
                the final payable amount are confirmed by the studio.
              </p>
            </div>
            <label className="checkout-consent">
              <input type="checkbox" required />{" "}
              <span>
                I agree to share these delivery details with AUREN through WhatsApp to request and
                arrange my order.
              </span>
            </label>
            <button type="submit" className="primary-button">
              Review COD request <ArrowUpRight size={18} />
            </button>
            <p className="checkout-disclosure">
              Next, review your request and open WhatsApp to send it. Your delivery details are kept
              in this page’s memory until you leave or refresh.
            </p>
          </form>
        )}
        <aside className="checkout-summary">
          <span className="eyebrow">Your selection / {bag.count} pieces</span>
          <h2>Considered choices.</h2>
          <ul>
            {bag.items.map((item) => (
              <li key={`${item.productId}-${item.size}`}>
                <img src={productImage(item.productId)} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.color} / {item.size} / Qty {item.qty}
                  </p>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="checkout-total">
            <span>Product subtotal</span>
            <strong>{formatPrice(subtotal(bag.items))}</strong>
          </div>
          <div className="checkout-total">
            <span>Delivery</span>
            <span>Confirmed by studio</span>
          </div>
          <p>
            Catalogue prices are shown in EUR. If paying in NPR, ask us to confirm the NPR total
            before agreeing to the order.
          </p>
          <button className="text-link" onClick={() => bag.setOpen(true)}>
            Edit bag ↗
          </button>
          <div className="checkout-help">
            <span className="eyebrow">Prefer a conversation?</span>
            <a
              href={whatsappUrl("Hello AUREN, I need help with my order.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp · +977 9813463360 ↗
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Instagram · @bigyen_bhandari ↗
            </a>
          </div>
        </aside>
      </section>
    </>
  );
}
