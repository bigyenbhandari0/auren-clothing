import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreShell, Reveal } from "@/components/auren/StoreShell";
export const Route = createFileRoute("/care")({
  head: () => ({ meta: [{ title: "Sizing & client care — AUREN" }] }),
  component: Care,
});
function Care() {
  return (
    <StoreShell>
      <section className="page-intro">
        <Reveal>
          <span className="eyebrow">AUREN / Client care</span>
          <h1>
            The small
            <br />
            <em>details.</em>
          </h1>
        </Reveal>
      </section>
      <div className="care-layout section-space">
        <nav aria-label="Client care sections">
          <a href="#sizing">Sizing & fit</a>
          <a href="#care">Caring for your pieces</a>
          <a href="#delivery">Delivery & returns</a>
          <a href="#privacy">Privacy</a>
        </nav>
        <div>
          <section id="sizing">
            <span className="eyebrow">01 / Find your fit</span>
            <h2>Room to move.</h2>
            <p>
              Our concept collection is styled with relaxed proportions. Begin with your usual size.
              Tops use XS–XL, bottoms use waist sizes 28–36, and footwear uses European sizes 40–45.
              Individual measurements are not available for this demo.
            </p>
            <p>
              If you are between sizes, consider how much room you prefer. The full look view on
              each product page gives a sense of the intended silhouette.
            </p>
          </section>
          <section id="care">
            <span className="eyebrow">02 / Keep it considered</span>
            <h2>A little care goes a long way.</h2>
            <p>
              Follow the garment label first. As a general guide, wash cotton pieces inside out on a
              cool cycle, with similar colours. Air dry, avoid high heat and wash denim less
              frequently. Use a soft brush for footwear and a microfibre cloth for eyewear.
            </p>
          </section>
          <section id="delivery">
            <span className="eyebrow">03 / The storefront</span>
            <h2>Delivery & returns.</h2>
            <p>
              AUREN is a portfolio concept, with illustrative products and prices. Checkout,
              payment, shipping and returns are not active. You can explore pieces, select sizes and
              build a bag without placing an order.
            </p>
          </section>
          <section id="privacy">
            <span className="eyebrow">04 / Your information</span>
            <h2>Simply local.</h2>
            <p>
              Your shopping bag is saved in this browser's local storage. The intro uses session
              storage to remember your visit. Demo enquiry forms do not send or store the
              information you enter. You can remove the saved bag by clearing this site's browser
              data.
            </p>
            <Link to="/contact" className="text-link">
              More questions? Contact the studio ↗
            </Link>
          </section>
        </div>
      </div>
    </StoreShell>
  );
}
