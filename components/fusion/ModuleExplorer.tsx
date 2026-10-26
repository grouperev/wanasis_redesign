"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FeatureDialog from "@/components/annnimate/feature-dialog/feature-dialog";
import { AssetSlot } from "@/components/ui/Picture";
import { frTypo } from "@/lib/format";
import { FAMILY_BG, type Family, type FamilyId, type FusionModule } from "./types";

type Filter = FamilyId | "all";

/** Variable name of each family tone, for the dialog's top band. */
const FAMILY_VAR: Record<FamilyId, string> = {
  commercial: "var(--color-fam-commercial)",
  finance: "var(--color-fam-finance)",
  supply: "var(--color-fam-supply)",
  rh: "var(--color-fam-rh)",
  digital: "var(--color-fam-digital)",
};

/**
 * Sticky family filter + module grid + Annnimate feature-dialog sheet (one sheet shared by every tile).
 * #slug deep links open a module's sheet on load and on hashchange.
 */
export function ModuleExplorer({ families, modules }: { families: Family[]; modules: FusionModule[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  // The sheet keeps its content while it animates out.
  const [shownSlug, setShownSlug] = useState<string | null>(null);

  const familyLabel = useMemo(() => Object.fromEntries(families.map((f) => [f.id, f.label])) as Record<FamilyId, string>, [families]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: modules.length };
    for (const m of modules) c[m.family] = (c[m.family] ?? 0) + 1;
    return c;
  }, [modules]);
  const current = modules.find((m) => m.slug === shownSlug) ?? null;

  const open = useCallback((slug: string) => {
    setShownSlug(slug);
    setOpenSlug(slug);
  }, []);
  const close = useCallback(() => setOpenSlug(null), []);

  useEffect(() => {
    const sync = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      if (slug && modules.some((m) => m.slug === slug && m.body)) open(slug);
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", sync);
    };
  }, [modules, open]);

  const handleClosed = useCallback(() => {
    if (shownSlug) document.getElementById(shownSlug)?.querySelector("button")?.focus();
  }, [shownSlug]);

  return (
    <>
      <div className="sticky top-[var(--header-h)] z-30 border-b border-hairline bg-surface/95 backdrop-blur-md">
        <div role="group" aria-label="Familles de modules" className="container-x flex gap-2 overflow-x-auto py-3">
          {[{ id: "all" as const, label: "Tous" }, ...families].map((f) => {
            const pressed = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => setFilter(f.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-small transition-colors duration-150 ${
                  pressed ? "border-depth bg-depth text-white" : "border-hairline bg-surface hover:border-ink/20"
                }`}
              >
                {f.id !== "all" && <span aria-hidden className={`size-2.5 rounded-full ring-1 ring-white/70 ${FAMILY_BG[f.id]}`} />}
                <span>{f.label}</span>
                <span className={`font-display tabular-nums ${pressed ? "text-white/80" : "text-ink-2"}`}>{counts[f.id] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="container-x py-12 md:py-16">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {modules.map((m) => {
            const inner = (
              <>
                {/* family band; the original tile color is the 24px chip inside it, so names never wrap around it */}
                <span aria-hidden className={`relative block h-1 w-full shrink-0 ${FAMILY_BG[m.family]}`}>
                  {m.chip && <span className="absolute left-6 top-0 h-1 w-6" style={{ backgroundColor: m.chip }} />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 p-4">
                  <span className="font-display text-h3">{m.name}</span>
                  <span className="truncate text-small text-ink-2">{familyLabel[m.family]}</span>
                  {m.body ? (
                    <span className="mt-auto pt-4 text-small font-medium text-teal-ink">
                      Voir le module <span aria-hidden>→</span>
                    </span>
                  ) : (
                    <span className="mt-auto pt-4 text-small text-ink-2">Description à venir</span>
                  )}
                </span>
              </>
            );
            const base = "flex h-full w-full flex-col overflow-hidden rounded-md border border-hairline bg-surface text-left";
            return (
              <li key={m.slug} id={m.slug} hidden={filter !== "all" && filter !== m.family} className="scroll-mt-[calc(var(--header-h)+80px)]">
                {m.body ? (
                  <button
                    type="button"
                    onClick={() => open(m.slug)}
                    aria-haspopup="dialog"
                    className={`${base} transition-[border-color,box-shadow] duration-150 hover:border-ink/20 hover:shadow-e1`}
                  >
                    {inner}
                  </button>
                ) : (
                  <div className={base}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <FeatureDialog
        open={openSlug !== null}
        onClose={close}
        onClosed={handleClosed}
        titleId="module-dialog-title"
        accent={current ? FAMILY_VAR[current.family] : undefined}
      >
        {current && (
          <>
            <p className="flex items-center gap-2 text-small text-ink-2">
              <span aria-hidden className={`size-2.5 rounded-full ${FAMILY_BG[current.family]}`} />
              {familyLabel[current.family]}
            </p>
            <h2 id="module-dialog-title" className="mt-2 font-display text-h2">
              {current.name}
            </h2>
            <AssetSlot label={`M-${current.slug} · ${current.name}`} ratio="3/2" className="mt-6 rounded-md" />
            <p className="mt-6 max-w-[68ch]">{frTypo(current.body ?? "")}</p>
          </>
        )}
      </FeatureDialog>
    </>
  );
}
