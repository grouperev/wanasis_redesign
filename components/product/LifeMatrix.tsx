"use client";

import { useState } from "react";
import AccordionItem from "@/components/annnimate/accordion/accordion";
import { frTypo } from "@/lib/format";

export type MatrixItem = { id: string; title: string; detail: string | null };
export type MatrixGroup = { id: string; label: string; items: MatrixItem[] };

/** Group labels and per-item titles are OQ-8 proposals: flagged with a dev-visible title attribute, never printed. */
const FLAG = "[à valider]";

/**
 * Life HIS accordion matrix: two groups, ONE row open at a time across the whole matrix.
 * Every row's text is in the server HTML; closed panels are collapsed by inline style, and the
 * <noscript> rule opens them all when JS is unavailable.
 */
export function LifeMatrix({ groups }: { groups: MatrixGroup[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="grid gap-16 lg:gap-24">
      <noscript>
        <style>{`.accordion_content{height:auto!important;visibility:visible!important}.accordion_icon{display:none}`}</style>
      </noscript>
      {groups.map((g) => {
        const headingId = `matrix-${g.id}`;
        return (
          <section key={g.id} aria-labelledby={headingId} className="grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
                <h2 id={headingId} title={FLAG} className="font-display text-h2">
                  {g.label}
                </h2>
                <span aria-hidden className="mt-4 block h-1 w-12 bg-teal" />
              </div>
            </div>
            <div className="border-t border-hairline lg:col-span-8">
              {g.items.map((it) => (
                <AccordionItem
                  key={it.id}
                  open={openId === it.id}
                  onToggle={() => setOpenId((cur) => (cur === it.id ? null : it.id))}
                  title={frTypo(it.title)}
                  titleLabel={FLAG}
                >
                  {it.detail ? <p>{frTypo(it.detail)}</p> : null}
                </AccordionItem>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
