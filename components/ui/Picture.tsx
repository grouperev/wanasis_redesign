import images from "@/lib/content/images.json";
import { photo } from "@/lib/photos";

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
  style?: React.CSSProperties;
};

/** Responsive AVIF/WebP picture from the image manifest (scripts/images.mjs). */
export function Picture({ src, alt, sizes, className, imgClassName, priority, placeholder = true, style }: Props) {
  const e = MANIFEST[src];
  if (!e) return <AssetSlot label={`image manquante · ${src}`} className={className} />;
  const set = (fmt: string) => e.widths.map((w) => `/img/${e.name}-${w}.${fmt} ${w}w`).join(", ");
  const largest = e.widths[e.widths.length - 1];
  return (
    <picture className={className} style={style}>
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
        decoding={priority ? "sync" : "async"}
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

/** An approved photograph by shot id (lib/photos.ts); the labelled slot until the shot exists. */
export function Photo({
  shot,
  label,
  sizes,
  className,
  imgClassName,
  priority,
  ratio,
  decorative,
}: {
  shot: string;
  label: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  ratio?: string;
  decorative?: boolean;
}) {
  const p = photo(shot);
  if (!p || !MANIFEST[p.src]) return <AssetSlot label={label} className={className} ratio={ratio} />;
  return (
    <Picture
      src={p.src}
      alt={decorative ? "" : p.alt}
      sizes={sizes}
      priority={priority}
      className={`block overflow-hidden ${className ?? ""}`}
      imgClassName={`size-full object-cover ${imgClassName ?? ""}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    />
  );
}
