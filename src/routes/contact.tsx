import { whatsappUrl, INSTAGRAM_URL } from "@/lib/ordering";
import { copyText } from "@/lib/clipboard";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/auren/StoreShell";
import { downloadSelection } from "@/lib/selection";
export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact the studio — AUREN" }] }),
  component: Contact,
});
function Contact() {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  return (
    <>
      <section className="page-intro">
        <Reveal>
          <span className="eyebrow">Client care / AUREN Studio</span>
          <h1>
            Start a<br />
            <em>conversation.</em>
          </h1>
          <p>A question about a piece, a fit, or the studio? Prepare your note here.</p>
        </Reveal>
      </section>
      <section className="contact-layout section-space">
        <div>
          <span className="eyebrow">A little guidance</span>
          <h2>Here to help.</h2>
          <div className="checkout-help">
            <a
              href={whatsappUrl("Hello AUREN, I have a question about the collection.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp · +977 9813463360 ↗
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Instagram · @bigyen_bhandari ↗
            </a>
          </div>
          <p>Explore our sizing and care notes before choosing your pieces.</p>
          <Link to="/care" className="text-link">
            Visit client care <ArrowUpRight size={17} />
          </Link>
          <p className="contact-note">
            Copy your completed enquiry to send through your preferred channel, or save a text copy.
            Your details stay in this browser. Messages are not sent automatically.
          </p>
        </div>
        {copied ? (
          <div role="status" className="contact-success">
            <Check size={30} />
            <h2>Your note is copied.</h2>
            <p>Paste it into your preferred messaging app to send.</p>
            <button
              className="text-link"
              onClick={() => downloadSelection(message, "auren-enquiry.txt")}
            >
              Download a copy <Download size={15} />
            </button>
            <button className="text-link" onClick={() => setCopied(false)}>
              Write another note ↗
            </button>
          </div>
        ) : (
          <form
            className="contact-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const text = `AUREN / Studio enquiry\n\nFrom: ${form.get("name")}\nEmail: ${form.get("email")}\nSubject: ${form.get("subject")}\n\n${form.get("message")}`;
              setMessage(text);
              try {
                await copyText(text);
                setCopied(true);
              } catch {
                downloadSelection(text, "auren-enquiry.txt");
                toast("Enquiry downloaded", {
                  description: "Clipboard unavailable. Your note was saved as a text file.",
                });
              }
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
            <button className="primary-button" type="submit">
              Copy enquiry <Copy size={18} />
            </button>
          </form>
        )}
      </section>
    </>
  );
}
