import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import posts from "@/lib/content/posts.json";
import { formatDate, frTypo } from "@/lib/format";

type Post = (typeof posts)[number];

function Meta({ p }: { p: Post }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-ink-2">
      {p.category && (
        <span className="rounded-xs bg-teal-ink/10 px-2 py-0.5 font-display uppercase tracking-[0.08em] text-teal-ink">{p.category}</span>
      )}
      <time dateTime={p.date}>{formatDate(p.date)}</time>
    </p>
  );
}

/**
 * Editorial news block (featured story + recent list), after the B2B blog patterns studied on Mobbin
 * (Slash, Clay, Customer.io): one dominant story, the rest scannable, no slider.
 */
export function NewsRail({ title }: { title: string }) {
  const [featured, ...rest] = posts.slice(0, 5);

  return (
    <section className="section-y bg-surface-2" aria-labelledby="actualites">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 border-b border-hairline pb-6">
          <h2 id="actualites" className="text-h2">
            {title}
          </h2>
          <Link href="/actualites/" className="group inline-flex shrink-0 items-center gap-2 font-medium text-navy">
            Toutes les actualités
            <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Featured story */}
          <article className="group relative lg:col-span-7">
            <div className="overflow-hidden rounded-lg bg-surface">
              {featured.cover && (
                <Picture
                  src={featured.cover}
                  alt=""
                  sizes="(min-width: 1024px) 720px, 100vw"
                  imgClassName="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              )}
            </div>
            <div className="mt-6">
              <Meta p={featured} />
              <h3 className="mt-3 text-h2 leading-[1.15]">
                <Link href={featured.route} className="after:absolute after:inset-0 group-hover:text-navy">
                  {frTypo(featured.title)}
                </Link>
              </h3>
              {featured.excerpt && <p className="measure mt-4 text-lead text-ink-2">{frTypo(featured.excerpt)}…</p>}
            </div>
          </article>

          {/* Recent list */}
          <ul className="divide-y divide-hairline border-y border-hairline lg:col-span-5 lg:self-start">
            {rest.map((p) => (
              <li key={p.slug}>
                <article className="group relative grid grid-cols-[1fr_7.5rem] items-center gap-5 py-5 sm:grid-cols-[1fr_9rem]">
                  <div>
                    <Meta p={p} />
                    <h3 className="mt-2 font-display text-[1.25rem] leading-snug">
                      <Link href={p.route} className="after:absolute after:inset-0 group-hover:text-navy">
                        {frTypo(p.title)}
                      </Link>
                    </h3>
                  </div>
                  <div className="overflow-hidden rounded-md bg-surface">
                    {p.cover && (
                      <Picture
                        src={p.cover}
                        alt=""
                        sizes="144px"
                        imgClassName="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                      />
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
