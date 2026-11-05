import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { StoreShell, Reveal } from "@/components/auren/StoreShell";
export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact the studio — AUREN" }] }),
  component: Contact,
});
function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <StoreShell>
      <section className="page-intro">
        <Reveal>
          <span className="eyebrow">Client care / AUREN Studio</span>
          <h1>
            Start a<br />
            <em>conversation.</em>
          </h1>
          <p>A question about a piece, a fit, or the studio? Leave a note.</p>
        </Reveal>
      </section>
      <section className="contact-layout section-space">
        <div>
          <span className="eyebrow">A little guidance</span>
          <h2>Here to help.</h2>
          <p>Explore our sizing and care notes before choosing your pieces.</p>
          <Link to="/care" className="text-link">
            Visit client care <ArrowUpRight size={17} />
          </Link>
          <p className="contact-note">
            This is a portfolio storefront. The form demonstrates the enquiry experience; it does
            not send a message.
          </p>
        </div>
        {sent ? (
          <div role="status" className="contact-success">
            <Check size={30} />
            <h2>Your note is ready.</h2>
            <p>This was a demo submission. No message was sent.</p>
            <button className="text-link" onClick={() => setSent(false)}>
              Write another note ↗
            </button>
          </div>
        ) : (
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label>
              Your name
              <input name="name" autoComplete="name" required maxLength={100} placeholder="Name" />
            </label>
            <label>
              Email address
              <input
                name="email"
                autoComplete="email"
                type="email"
                required
                maxLength={254}
                placeholder="you@example.com"
              />
            </label>
            <label>
              What is it about?
              <select name="subject">
                <option>Product & sizing</option>
                <option>Studio & collaborations</option>
                <option>Something else</option>
              </select>
            </label>
            <label>
              Your note
              <textarea
                name="message"
                required
                maxLength={3000}
                rows={5}
                placeholder="Tell us a little more…"
              />
            </label>
            <p>Demo only — nothing is sent or stored.</p>
            <button className="primary-button" type="submit">
              Preview enquiry <ArrowUpRight size={18} />
            </button>
          </form>
        )}
      </section>
    </StoreShell>
  );
}
