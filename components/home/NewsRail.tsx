import Link from "next/link";
import { Divider } from "@/components/motion/Divider";
import { Picture } from "@/components/ui/Picture";
import posts from "@/lib/content/posts.json";
import { formatDate } from "@/lib/format";
import { NewsStage } from "./NewsStage";

const SIZES = "(min-width: 1024px) 400px, 80vw";

const LABELS = {
  prev: "Actualité précédente",
  next: "Actualité suivante",
  status: "Actualité {i} sur {n}",
};

/** Latest 6 posts: a scroll-snap rail (SSR, no JS, reduced motion) that the scale-slider takes over when motion is allowed. */
export function NewsRail({ title }: { title: string }) {
  const latest = posts.slice(0, 6);

  const meta = (p: (typeof latest)[number]) => (
    <>
      {p.category && <span className="text-teal-ink">{p.category} · </span>}
      Publié le <time dateTime={p.date}>{formatDate(p.date)}</time>
    </>
  );

  const slides = latest.map((p) => ({
    key: p.slug,
    href: p.route,
    title: p.title,
    meta: meta(p),
    cover: p.cover ? <Picture src={p.cover} alt="" sizes="(min-width: 1024px) 340px, 60vw" imgClassName="size-full object-cover" className="block size-full" /> : null,
  }));

  return (
    <section className="section-y relative" aria-labelledby="actualites">
      <Divider className="absolute inset-x-0 top-0 z-10 -translate-y-1/2" />
      <div className="container-x flex items-end justify-between gap-6">
        <h2 id="actualites" className="text-h2">
          {title}
        </h2>
        <Link href="/actualites/" className="link hidden shrink-0 sm:inline">
          Toutes les actualités
        </Link>
      </div>
      <div className="mt-10">
        <NewsStage posts={slides} labels={{ ...LABELS, region: title }}>
          <ul className="container-x flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
            {latest.map((p) => (
              <li key={p.slug} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
                <article className="group relative flex h-full flex-col">
                  <div className="overflow-hidden rounded-md bg-surface-2">
                    {p.cover && (
                      <Picture
                        src={p.cover}
                        alt=""
                        sizes={SIZES}
                        imgClassName="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <p className="mt-5 text-small text-ink-2">{meta(p)}</p>
                  <h3 className="mt-2 text-h3">
                    <Link href={p.route} className="after:absolute after:inset-0 hover:text-teal-ink">
                      {p.title}
                    </Link>
                  </h3>
                </article>
              </li>
            ))}
          </ul>
        </NewsStage>
      </div>
      <div className="container-x mt-6 sm:hidden">
        <Link href="/actualites/" className="link">
          Toutes les actualités
        </Link>
      </div>
    </section>
  );
}
