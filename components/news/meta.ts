import type { Metadata } from "next";

/** Per-route metadata from docs/redesign/crawl/meta.json (via lib/content/*.json). Canonical points to itself. */
export function pageMetadata(opts: {
  title: string;
  route: string;
  description?: string | null;
  type?: "website" | "article";
  image?: { url: string; width: number; height: number } | null;
  extra?: Record<string, unknown>;
}): Metadata {
  const { title, route, description, type = "website", image, extra } = opts;
  const desc = description ?? undefined;
  return {
    title,
    description: desc,
    alternates: { canonical: route },
    openGraph: {
      title,
      description: desc,
      url: route,
      type,
      locale: "fr_FR",
      siteName: "Wanasis",
      images: image ? [image] : undefined,
      ...extra,
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description: desc },
  };
}
