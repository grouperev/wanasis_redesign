import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import posts from "@/lib/content/posts.json";
import { formatDate } from "@/lib/format";

/** v0 of the scale-slider: latest 6 posts in a scroll-snap rail. */
export function NewsRail({ title }: { title: string }) {
  const latest = posts.slice(0, 6);
  return (
    <section className="section-y overflow-hidden" aria-labelledby="actualites">
      <div className="container-x flex items-end justify-between gap-6">
        <h2 id="actualites" className="text-h2">
          {title}
        </h2>
        <Link href="/actualites/" className="link hidden shrink-0 sm:inline">
          Toutes les actualités
        </Link>
      </div>
      <ul className="container-x mt-10 flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
        {latest.map((p) => (
          <li key={p.slug} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
            <article className="group relative flex h-full flex-col">
              <div className="overflow-hidden rounded-md bg-surface-2">
                {p.cover && (
                  <Picture
                    src={p.cover}
                    alt=""
                    sizes="(min-width: 1024px) 400px, 80vw"
                    imgClassName="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <p className="mt-5 text-small text-ink-2">
                {p.category && <span className="text-teal-ink">{p.category} · </span>}
                Publié le <time dateTime={p.date}>{formatDate(p.date)}</time>
              </p>
              <h3 className="mt-2 text-h3">
                <Link href={p.route} className="after:absolute after:inset-0 hover:text-teal-ink">
                  {p.title}
                </Link>
              </h3>
            </article>
          </li>
        ))}
      </ul>
      <div className="container-x mt-6 sm:hidden">
        <Link href="/actualites/" className="link">
          Toutes les actualités
        </Link>
      </div>
    </section>
  );
}
