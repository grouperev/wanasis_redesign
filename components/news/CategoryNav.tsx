import Link from "next/link";

const LINKS = [
  { label: "Tous", href: "/actualites/" },
  { label: "Article", href: "/article/" },
  { label: "News", href: "/news/" },
];

/** Category archives as real links (used on /article/ and /news/). */
export function CategoryNav({ current }: { current: "Article" | "News" }) {
  const chip = "inline-flex min-h-11 items-center rounded-full border px-5 font-display text-small uppercase tracking-[0.06em] transition-colors duration-150";
  return (
    <nav aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2">
      {LINKS.map((l) => {
        const on = l.label === current;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={on ? "page" : undefined}
            className={`${chip} ${on ? "border-depth bg-depth text-white" : "border-hairline bg-surface text-ink hover:border-ink"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
