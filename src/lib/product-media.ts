const FILES: Record<string, string> = {
  "p-rust-crew": "rust",
  "p-grey-crew": "grey-crew",
  "p-graphite-crew": "graphite-crew",
  "p-white-tee": "white-tee",
  "p-black-shirt": "black-shirt",
  "p-charcoal-trouser": "charcoal-trouser",
  "p-pale-baggy": "pale-baggy",
  "p-mid-loose": "mid-loose",
  "p-olive-wide": "olive-wide",
  "p-pale-xwide": "pale-xwide",
  "p-black-court": "black-court",
  "p-white-court": "white-court",
  "p-white-court-2": "white-court",
  "p-grey-runner": "grey-runner",
  "p-grey-runner-2": "grey-runner",
  "p-black-shades": "black-shades",
};
export const productImage = (id: string) => `/products/${FILES[id] ?? id}.webp`;
