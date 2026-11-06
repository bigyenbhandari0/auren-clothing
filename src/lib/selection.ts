import { type BagItem, subtotal } from "./bag";
import { formatPrice } from "./looks";
export function selectionText(items: BagItem[]) {
  return [
    "AUREN / MY SELECTION",
    "",
    ...items.map(
      (x) =>
        `${x.name} — ${x.color} / Size ${x.size} / Qty ${x.qty} / ${formatPrice(x.price * x.qty)}`,
    ),
    "",
    `Subtotal: ${formatPrice(subtotal(items))}`,
    "",
    "This is a product selection, not a placed or paid order.",
  ].join("\n");
}
export function downloadSelection(text: string, filename = "auren-selection.txt") {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
