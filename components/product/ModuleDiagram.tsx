import Link from "next/link";
import { FAMILY_BG, type Family, type FusionModule } from "@/components/fusion/types";

/**
 * The 25-tile module diagram of erp-modules.png, re-drawn as real HTML: one row per family,
 * family tone + the tile's original color as a 24px chip, every tile links to its module card.
 * (Trésorerie has no tile in the original diagram, so it is not drawn here.)
 */
export function ModuleDiagram({ families, modules }: { families: Family[]; modules: FusionModule[] }) {
  const tiles = modules.filter((m) => m.slug !== "tresorerie");
  return (
    <div className="grid gap-6">
      {families.map((f) => {
        const row = tiles.filter((m) => m.family === f.id);
        return (
          <section key={f.id} aria-label={f.label} className="grid gap-3 md:grid-cols-[minmax(0,10rem)_1fr] md:gap-6">
            <h3 className="flex items-center gap-2 font-display text-small uppercase tracking-[0.08em] text-ink-2 md:pt-4">
              <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${FAMILY_BG[f.id]}`} />
              {f.label}
            </h3>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {row.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/wanasis-fusion-erp-modules/#${m.slug}`}
                    className={`group relative flex min-h-14 items-center rounded-md px-4 pb-3 pt-4 font-display text-lead text-white transition-shadow duration-150 hover:shadow-e2 ${FAMILY_BG[f.id]}`}
                  >
                    {m.chip && (
                      <span aria-hidden className="absolute left-4 top-0 h-1 w-6 rounded-b-xs" style={{ backgroundColor: m.chip }} />
                    )}
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
