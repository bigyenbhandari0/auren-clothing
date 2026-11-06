import { MODEL_CUTOUTS } from "@/lib/model-cutouts";
import { cn } from "@/lib/utils";

export function modelForImage(image: string) {
  const index = Number(image.split("#")[1] ?? 0);
  return MODEL_CUTOUTS[index] ?? MODEL_CUTOUTS[0]!;
}
/** Transparent PNGs, with optional close framing for editorial panels. */
export function Portrait({
  image,
  alt,
  className,
  framing = "look",
}: {
  image: string;
  alt: string;
  className?: string;
  framing?: "look" | "figure";
}) {
  const model = modelForImage(image);
  const box = framing === "figure" ? model.figureBox : model.lookBox;
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={!alt || undefined}
      className={cn(className, "portrait-cutout")}
    >
      <svg
        viewBox={box.join(" ")}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <image href={model.src} width={model.width} height={model.height} />
      </svg>
    </div>
  );
}
