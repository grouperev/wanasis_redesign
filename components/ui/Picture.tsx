import images from "@/lib/content/images.json";

type Entry = { name: string; width: number; height: number; widths: number[]; lqip: string };
const MANIFEST = images as Record<string, Entry>;

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Blurred LQIP behind the image while it loads. Off for transparent logos. */
  placeholder?: boolean;
};

/** Responsive AVIF/WebP picture from the image manifest (scripts/images.mjs). */
export function Picture({ src, alt, sizes, className, imgClassName, priority, placeholder = true }: Props) {
  const e = MANIFEST[src];
  if (!e) return <AssetSlot label={`image manquante · ${src}`} className={className} />;
  const set = (fmt: string) => e.widths.map((w) => `/img/${e.name}-${w}.${fmt} ${w}w`).join(", ");
  const largest = e.widths[e.widths.length - 1];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      { }
      <img
        src={`/img/${e.name}-${largest}.webp`}
        alt={alt}
        width={e.width}
        height={e.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={imgClassName}
        style={placeholder ? { backgroundImage: `url(${e.lqip})`, backgroundSize: "cover" } : undefined}
      />
    </picture>
  );
}

/** Honest placeholder for an asset still to be produced (Garden placeholder rule). */
export function AssetSlot({ label, className, ratio }: { label: string; className?: string; ratio?: string }) {
  return (
    <div className={`asset-slot ${className ?? ""}`} style={ratio ? { aspectRatio: ratio } : undefined} role="img" aria-label={label}>
      <span className="px-4">[{label}]</span>
    </div>
  );
}
