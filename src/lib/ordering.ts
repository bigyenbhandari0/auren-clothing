import { subtotal, type BagItem } from "./bag";
import { formatPrice } from "./looks";
export const WHATSAPP_NUMBER = "9779813463360";
export const INSTAGRAM_URL = "https://www.instagram.com/bigyen_bhandari/";
export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
export interface DeliveryDetails {
  name: string;
  phone: string;
  city: string;
  address: string;
  landmark: string;
  note: string;
}
export function orderMessage(items: BagItem[], delivery: DeliveryDetails, reference: string) {
  return [
    `AUREN / COD order request ${reference}`,
    "Please confirm availability, delivery fee and final payable amount before dispatch.",
    "",
    ...items.map(
      (item, i) =>
        `${i + 1}. ${item.name} (${item.productId})\n${item.color} / Size ${item.size} / Qty ${item.qty}\n${formatPrice(item.price * item.qty)}`,
    ),
    "",
    `Product subtotal: ${formatPrice(subtotal(items))}`,
    "Delivery: to be confirmed",
    "Payment: Cash on delivery",
    "",
    `Customer: ${delivery.name}`,
    `Phone: ${delivery.phone}`,
    `City / district: ${delivery.city}`,
    `Delivery address: ${delivery.address}`,
    delivery.landmark && `Landmark: ${delivery.landmark}`,
    delivery.note && `Note: ${delivery.note}`,
  ].join("\n");
}
