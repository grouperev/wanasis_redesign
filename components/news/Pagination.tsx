import Link from "next/link";
import { PAGE_COUNT, pageHref } from "./posts";

/** Real links to /actualites/ and /actualites/page/N/ (old WordPress URLs keep working). */
export function Pagination({ current }: { current: number }) {
  const pages = Array.from({ length: PAGE_COUNT }, (_, i) => i + 1);
  const item = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm px-3 font-display transition-colors duration-150";
  return (
    <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center justify-center gap-2 border-t border-hairline pt-8">
      {current > 1 && (
        <Link href={pageHref(current - 1)} rel="prev" className={`${item} hover:bg-surface-2`}>
          Précédent
        </Link>
      )}
      {pages.map((n) =>
        n === current ? (
          <span key={n} aria-current="page" className={`${item} bg-depth text-white`}>
            <span className="sr-only">Page </span>
            {n}
          </span>
        ) : (
          <Link key={n} href={pageHref(n)} className={`${item} hover:bg-surface-2`}>
            <span className="sr-only">Page </span>
            {n}
          </Link>
        ),
      )}
      {current < PAGE_COUNT && (
        <Link href={pageHref(current + 1)} rel="next" className={`${item} hover:bg-surface-2`}>
          Suivant
        </Link>
      )}
    </nav>
  );
}
