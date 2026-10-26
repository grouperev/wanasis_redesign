"use client";

import { useState, type ReactNode } from "react";

export type NewsItem = {
  slug: string;
  category: string;
  /** Grid card, rendered on the server. */
  card: ReactNode;
  /** Featured variant — only provided for the items that can become the first visible one. */
  featured?: ReactNode;
};

const ALL = "Tous";

/**
 * Category filter over server-rendered cards. Without JS every item is in the DOM and visible
 * (the first one featured); with JS the chips toggle visibility, nothing is re-fetched.
 */
export function NewsList({ items, categories, featureFirst }: { items: NewsItem[]; categories: string[]; featureFirst: boolean }) {
  const [active, setActive] = useState(ALL);
  const visible = items.filter((i) => active === ALL || i.category === active);
  const first = featureFirst ? visible[0] : undefined;
  const rest = first ? visible.slice(1) : visible;
  const chip = "inline-flex min-h-11 items-center rounded-full border px-5 font-display text-small uppercase tracking-[0.06em] transition-colors duration-150";

  return (
    <>
      <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2">
        {[ALL, ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={`${chip} ${active === c ? "border-depth bg-depth text-white" : "border-hairline bg-surface text-ink hover:border-ink"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} publications
      </p>

      {first && <div className="mt-12">{first.featured ?? first.card}</div>}
      <ul className={`${first ? "mt-16 border-t border-hairline pt-16" : "mt-12"} grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3`}>
        {rest.map((i) => (
          <li key={i.slug}>{i.card}</li>
        ))}
      </ul>
    </>
  );
}
