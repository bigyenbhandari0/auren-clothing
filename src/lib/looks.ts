import l1 from "@/assets/looks/look-1.jpg.asset.json";
import l2 from "@/assets/looks/look-2.jpg.asset.json";
import l3 from "@/assets/looks/look-3.jpg.asset.json";
import l4 from "@/assets/looks/look-4.jpg.asset.json";
import l5 from "@/assets/looks/look-5.jpg.asset.json";

/** Portrait crops are 310x900 px. */
export const PORTRAIT_RATIO = 310 / 900;

export type Category = "Top" | "Bottom" | "Shoes" | "Eyewear";

export interface Product {
  id: string;
  name: string;
  category: Category;
  color: string;
  price: number;
  sizes: string[];
  /** Hotspot position, % of the displayed portrait. */
  hotspot: { x: number; y: number };
  /** Thumbnail focus: center (% of portrait) and zoom factor. */
  thumb: { x: number; y: number; zoom: number };
}

export interface Look {
  id: string;
  name: string;
  image: string;
  products: Product[];
}

const TOP = ["XS", "S", "M", "L", "XL"];
const WAIST = ["28", "30", "32", "34", "36"];
const SHOE = ["40", "41", "42", "43", "44", "45"];

export const LOOKS: Look[] = [
  {
    id: "look-1",
    name: "Rust Study",
    image: l1.url,
    products: [
      { id: "p-rust-crew", name: "Heavy Loop Crew", category: "Top", color: "Rust", price: 128, sizes: TOP, hotspot: { x: 52, y: 32 }, thumb: { x: 50, y: 32, zoom: 2.2 } },
      { id: "p-charcoal-trouser", name: "Pleated Wide Trouser", category: "Bottom", color: "Charcoal", price: 165, sizes: WAIST, hotspot: { x: 50, y: 66 }, thumb: { x: 50, y: 70, zoom: 1.7 } },
      { id: "p-black-court", name: "Low Court Sneaker", category: "Shoes", color: "Black", price: 140, sizes: SHOE, hotspot: { x: 38, y: 94 }, thumb: { x: 50, y: 94, zoom: 3.4 } },
    ],
  },
  {
    id: "look-2",
    name: "Pale Wash",
    image: l2.url,
    products: [
      { id: "p-grey-crew", name: "Brushed Fleece Crew", category: "Top", color: "Heather grey", price: 118, sizes: TOP, hotspot: { x: 50, y: 30 }, thumb: { x: 50, y: 31, zoom: 2.2 } },
      { id: "p-pale-baggy", name: "Baggy Five-Pocket Jean", category: "Bottom", color: "Pale blue", price: 150, sizes: WAIST, hotspot: { x: 38, y: 68 }, thumb: { x: 50, y: 70, zoom: 1.6 } },
      { id: "p-white-court", name: "Leather Court Sneaker", category: "Shoes", color: "White", price: 135, sizes: SHOE, hotspot: { x: 38, y: 94 }, thumb: { x: 50, y: 94, zoom: 3.4 } },
    ],
  },
  {
    id: "look-3",
    name: "Washed Graphite",
    image: l3.url,
    products: [
      { id: "p-graphite-crew", name: "Garment-Dyed Crew", category: "Top", color: "Washed charcoal", price: 124, sizes: TOP, hotspot: { x: 50, y: 30 }, thumb: { x: 50, y: 31, zoom: 2.2 } },
      { id: "p-mid-loose", name: "Loose Rigid Jean", category: "Bottom", color: "Mid blue", price: 155, sizes: WAIST, hotspot: { x: 40, y: 68 }, thumb: { x: 50, y: 70, zoom: 1.7 } },
      { id: "p-grey-runner", name: "Mesh Trail Runner", category: "Shoes", color: "Grey", price: 160, sizes: SHOE, hotspot: { x: 38, y: 93 }, thumb: { x: 50, y: 93, zoom: 3.4 } },
    ],
  },
  {
    id: "look-4",
    name: "Olive Fade",
    image: l4.url,
    products: [
      { id: "p-white-tee", name: "Boxy Heavyweight Tee", category: "Top", color: "Optic white", price: 68, sizes: TOP, hotspot: { x: 52, y: 30 }, thumb: { x: 50, y: 30, zoom: 2.1 } },
      { id: "p-olive-wide", name: "Wide Leg Fade Jean", category: "Bottom", color: "Washed olive", price: 160, sizes: WAIST, hotspot: { x: 38, y: 70 }, thumb: { x: 50, y: 71, zoom: 1.7 } },
      { id: "p-white-court-2", name: "Leather Court Sneaker", category: "Shoes", color: "White", price: 135, sizes: SHOE, hotspot: { x: 38, y: 94 }, thumb: { x: 50, y: 94, zoom: 3.4 } },
    ],
  },
  {
    id: "look-5",
    name: "Night Collar",
    image: l5.url,
    products: [
      { id: "p-black-shades", name: "Square Acetate Frame", category: "Eyewear", color: "Black", price: 95, sizes: ["One size"], hotspot: { x: 45, y: 10 }, thumb: { x: 45, y: 10, zoom: 5 } },
      { id: "p-black-shirt", name: "Camp Collar Shirt", category: "Top", color: "Black", price: 115, sizes: TOP, hotspot: { x: 58, y: 34 }, thumb: { x: 50, y: 32, zoom: 2 } },
      { id: "p-pale-xwide", name: "Extra Wide Jean", category: "Bottom", color: "Bleached blue", price: 158, sizes: WAIST, hotspot: { x: 40, y: 70 }, thumb: { x: 50, y: 71, zoom: 1.6 } },
      { id: "p-grey-runner-2", name: "Mesh Trail Runner", category: "Shoes", color: "Grey white", price: 160, sizes: SHOE, hotspot: { x: 38, y: 94 }, thumb: { x: 50, y: 94, zoom: 3.4 } },
    ],
  },
];

export const formatPrice = (n: number) => `€${n.toFixed(0)}`;
