"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AssetSlot } from "@/components/ui/Picture";
import { FAMILY_BG, type Family, type FamilyId, type FusionModule } from "./types";

type Filter = FamilyId | "all";

/**
 * Sticky family filter + module grid + native <dialog>.
 * Phase 5: the tag-cloud / dialog enhancements can replace the inner blocks without changing this layout.
 */
export function ModuleExplorer({ families, modules }: { families: Family[]; modules: FusionModule[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastSlug = useRef<string | null>(null);

  const familyLabel = useMemo(() => Object.fromEntries(families.map((f) => [f.id, f.label])) as Record<FamilyId, string>, [families]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: modules.length };
    for (const m of modules) c[m.family] = (c[m.family] ?? 0) + 1;
    return c;
  }, [modules]);
  const current = modules.find((m) => m.slug === openSlug && m.body) ?? null;

  const open = useCallback((slug: string) => {
    lastSlug.current = slug;
    setOpenSlug(slug);
  }, []);

  // Deep link: /wanasis-fusion-erp-modules/#crm opens the module on load (and on hashchange).
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

  useEffect(() => {
    const d = dialogRef.current;
    if (current && d && !d.open) d.showModal();
  }, [current]);

  useEffect(() => {
    if (!current) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [current]);

  const handleClose = () => {
    setOpenSlug(null);
    const slug = lastSlug.current;
    if (slug) document.getElementById(slug)?.querySelector("button")?.focus();
  };

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
                <span aria-hidden className={`block h-1 w-full ${FAMILY_BG[m.family]}`} />
                <span className="flex flex-1 flex-col gap-1 p-4">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-h3">{m.name}</span>
                    {m.chip && <span aria-hidden className="h-1 w-6 shrink-0 rounded-xs" style={{ backgroundColor: m.chip }} />}
                  </span>
                  <span className="text-small text-ink-2">{familyLabel[m.family]}</span>
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

      <dialog
        ref={dialogRef}
        aria-labelledby="module-dialog-title"
        onClose={handleClose}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto max-h-[calc(100dvh-32px)] w-[min(100%-32px,720px)] overflow-y-auto rounded-lg border border-hairline bg-surface p-0 text-ink shadow-e2 backdrop:bg-ink/50"
      >
        {current && (
          <div className="relative p-6 md:p-8">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-sm text-ink hover:bg-surface-2"
            >
              <span className="sr-only">Fermer</span>
              <svg aria-hidden width="16" height="16" viewBox="0 0 16 16">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <p className="flex items-center gap-2 pr-12 text-small text-ink-2">
              <span aria-hidden className={`size-2.5 rounded-full ${FAMILY_BG[current.family]}`} />
              {familyLabel[current.family]}
            </p>
            <h2 id="module-dialog-title" className="mt-2 pr-12 font-display text-h2">
              {current.name}
            </h2>
            <AssetSlot label={`M · ${current.name}`} ratio="3/2" className="mt-6 rounded-md" />
            <p className="mt-6 max-w-[68ch]">{current.body}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
