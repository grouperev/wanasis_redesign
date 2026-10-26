"use client";

import { useRef, useState } from "react";
import { AssetSlot } from "@/components/ui/Picture";
import { frTypo } from "@/lib/format";

type T = { quote: string; name: string; role: string; company: string };

// Ambient industry backdrops (T1–T4). Never a person standing in for the quoted client.
const SCENES = ["T1 · hub de distribution", "T2 · ligne de production", "T3 · quai logistique", "T4 · couloir de clinique"];

/** v0 of the curtain-slider: one full-bleed slide per client, arrows + keyboard + swipe (native scroll-snap). */
export function Testimonials({ title, items }: { title: string; items: T[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = (i + items.length) % items.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setIndex(next);
  };

  return (
    <section className="on-dark relative bg-depth text-white" aria-roledescription="carrousel" aria-labelledby="temoignages">
      <div className="container-x flex items-end justify-between gap-6 pt-20 md:pt-28">
        <h2 id="temoignages" className="text-h2">
          {title}
        </h2>
        <div className="flex gap-2">
          {[
            { d: -1, label: "Témoignage précédent", path: "M9 1L3 7l6 6" },
            { d: 1, label: "Témoignage suivant", path: "M3 1l6 6-6 6" },
          ].map((b) => (
            <button
              key={b.d}
              type="button"
              onClick={() => go(index + b.d)}
              className="grid size-12 place-items-center rounded-sm border border-hairline-dark hover:border-white"
            >
              <span className="sr-only">{b.label}</span>
              <svg aria-hidden width="12" height="14" viewBox="0 0 12 14">
                <path d={b.path} fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={track}
        tabIndex={0}
        aria-label={title}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="mt-10 flex snap-x snap-mandatory overflow-x-auto pb-20 [scrollbar-width:none] md:pb-28"
      >
        {items.map((t, i) => (
          <li
            key={t.company}
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${items.length}`}
            className="w-full shrink-0 snap-start"
          >
            <figure className="container-x grid gap-8 lg:grid-cols-12 lg:items-center">
              <AssetSlot label={SCENES[i]} className="aspect-[3/2] rounded-lg lg:col-span-5" />
              <div className="lg:col-span-7 lg:pl-8">
                <blockquote className="text-lead text-white md:text-[1.5rem] md:leading-[1.5]">
                  <p>{frTypo(`« ${t.quote} »`)}</p>
                </blockquote>
                <figcaption className="mt-8 border-t border-hairline-dark pt-6">
                  <span className="block font-display text-h3">{t.name}</span>
                  <span className="text-white/80">
                    {t.role}, {t.company}
                  </span>
                </figcaption>
              </div>
            </figure>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        Témoignage {index + 1} sur {items.length}
      </p>
    </section>
  );
}
