"use client";

import { useMemo, useState, type ReactNode } from "react";

export type WallItem = { file: string; name: string; /** Picture, rendered on the server. */ logo: ReactNode };

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Searchable logo wall. Without JS the search field does nothing and every logo stays visible. */
export function LogoWall({ items }: { items: WallItem[] }) {
  const [q, setQ] = useState("");
  const index = useMemo(() => items.map((i) => ({ item: i, key: fold(`${i.name} ${i.file}`) })), [items]);
  const needle = fold(q.trim());
  const shown = needle ? index.filter((e) => e.key.includes(needle)).map((e) => e.item) : items;

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-md">
        <label htmlFor="client-search" className="eyebrow">
          Rechercher un client
        </label>
        <input
          id="client-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="mt-2 block min-h-12 w-full rounded-xs border border-ink/30 bg-surface px-4 text-ink placeholder:text-ink-2 hover:border-ink"
        />
        <p className="mt-2 min-h-6 text-small text-ink-2" role="status" aria-live="polite">
          {needle ? `${shown.length} résultat${shown.length > 1 ? "s" : ""}` : ""}
        </p>
      </form>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
        {shown.map((i) => (
          <li key={i.file} className="group">
            <div className="grid aspect-square place-items-center rounded-md bg-surface-2 p-5 transition-colors duration-150 group-hover:bg-white group-hover:shadow-e1 group-focus-within:bg-white">
              {i.logo}
            </div>
            <p className="mt-2 text-center text-small text-ink-2">{i.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
