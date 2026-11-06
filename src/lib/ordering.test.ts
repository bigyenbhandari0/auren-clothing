import { describe, expect, it } from "vitest";
import { orderMessage, whatsappUrl } from "./ordering";
import { LOOKS } from "./looks";
describe("COD request handoff", () => {
  it("addresses the Nepal WhatsApp number and safely encodes customer text", () => {
    const text = "Name: Ram & Sita\nAddress: #4 + lane";
    const url = new URL(whatsappUrl(text));
    expect(url.pathname).toBe("/9779813463360");
    expect(url.searchParams.get("text")).toBe(text);
  });
  it("includes delivery details, sizes, quantities and pending delivery charges", () => {
    const look = LOOKS[0]!;
    const p = look.products[0]!;
    const text = orderMessage(
      [
        {
          lookId: look.id,
          productId: p.id,
          name: p.name,
          color: p.color,
          size: p.sizes[0]!,
          price: p.price,
          qty: 2,
        },
      ],
      {
        name: "Test Customer",
        phone: "9800000000",
        city: "Kathmandu",
        address: "Test street 4",
        landmark: "Near school",
        note: "Call first",
      },
      "AR-TEST",
    );
    expect(text).toContain("AR-TEST");
    expect(text).toContain("Qty 2");
    expect(text).toContain("Customer: Test Customer");
    expect(text).toContain("Delivery address: Test street 4");
    expect(text).toContain("Landmark: Near school");
    expect(text).toContain("Payment: Cash on delivery");
    expect(text).toContain("Delivery: to be confirmed");
  });
});
