import { LOOKS, type Category } from "./looks";
export const CATALOG = LOOKS.flatMap((look) => look.products.map((product) => ({ product, look })));
export const CATEGORIES: ("All" | Category)[] = ["All", "Top", "Bottom", "Shoes", "Eyewear"];
export function productDetails(category: Category) {
  const details = {
    Top: {
      material: "Cotton jersey and fleece",
      fit: "A relaxed silhouette with room through the body. Choose your usual size for an easy fit.",
      care: "Wash inside out on a cool, gentle cycle. Reshape while damp and air dry.",
    },
    Bottom: {
      material: "Cotton denim and woven twill",
      fit: "A wide, relaxed leg with a comfortable rise. Select your usual waist size.",
      care: "Wash only when needed, inside out with similar colours. Air dry away from direct heat.",
    },
    Shoes: {
      material: "Mixed leather, textile and rubber",
      fit: "Standard European sizing. Choose your usual size; allow space at the toe.",
      care: "Brush away dry dirt, then wipe gently with a damp cloth. Air dry naturally.",
    },
    Eyewear: {
      material: "Acetate-style frame",
      fit: "One size. A squared silhouette with a comfortable everyday profile.",
      care: "Clean with a soft microfibre cloth and store in a protective case.",
    },
  };
  return details[category];
}
