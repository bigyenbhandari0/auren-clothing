import type { CSSProperties } from "react";

/** Render one of five equal portrait columns without duplicating or resampling the source. */
export function portraitStyle(image: string): CSSProperties {
  const index = Number(image.split("#")[1] || 0);
  return {
    backgroundImage: `url("${image.split("#")[0]}")`,
    backgroundSize: "500% 100%",
    backgroundPosition: `${index * 25}% center`,
    backgroundRepeat: "no-repeat",
  };
}

export function Portrait({ image, alt, className }: { image: string; alt: string; className?: string }) {
  return <div role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={!alt || undefined}
    className={className} style={portraitStyle(image)} />;
}
