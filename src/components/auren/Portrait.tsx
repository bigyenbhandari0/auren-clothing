import { MODEL_CUTOUTS } from "@/lib/model-cutouts";
import { cn } from "@/lib/utils";
import { useId } from "react";

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
  const shadowId = `shadow-${useId().replace(/:/g, "")}`;
  const feet = model.figureBox[1] + model.figureBox[3] - 36;
  const center = model.figureBox[0] + model.figureBox[2] / 2;
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
        <defs>
          <filter id={shadowId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <g className="model-ground-shadow" fill="#30271e" filter={`url(#${shadowId})`}>
          <ellipse cx={center + 38} cy={feet + 9} rx="142" ry="19" opacity="0.15" />
          <ellipse cx={center} cy={feet + 1} rx="91" ry="10" opacity="0.38" />
          <path
            d={`M ${center - 78} ${feet} Q ${center + 150} ${feet + 5} ${center + 222} ${feet - 46} Q ${center + 148} ${feet - 60} ${center + 53} ${feet - 5} Z`}
            opacity="0.12"
          />
        </g>
        <image href={model.src} width={model.width} height={model.height} />
      </svg>
    </div>
  );
}
