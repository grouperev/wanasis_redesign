import manifest from "@/assets/generated/manifest.json";

type Shot = { slug: string; shot: string; alt_fr: string };

/** Approved generated photographs by shot id (docs/redesign/images.md), e.g. photo("H1"), photo("M-crm"). */
export function photo(shot: string): { src: string; alt: string } | null {
  const m = (manifest as Shot[]).find((e) => e.shot === shot);
  return m ? { src: `${m.slug}.webp`, alt: m.alt_fr } : null;
}
