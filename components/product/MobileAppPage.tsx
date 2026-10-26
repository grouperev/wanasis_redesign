import Link from "next/link";
import { AssetSlot } from "@/components/ui/Picture";
import fusion from "@/lib/content/fusion.json";
import mobile from "@/lib/content/mobile.json";
import { frTypo } from "@/lib/format";

export type MobileSlug = "view" | "link" | "pick" | "ship";

type Block = { heading: string; body: string; list?: string[] };
type Page = {
  slug: MobileSlug;
  name: string;
  back: string;
  h1: string;
  lead: string | null;
  leadList?: string[];
  fallback: string | null;
  blocks: Block[];
};

/**
 * Template for /mobile-{view,link,pick,ship}/.
 * Pick and Ship have no page copy in the crawl (OQ-12): they render the app's paragraph from the Fusion page.
 */
export function MobileAppPage({ slug }: { slug: MobileSlug }) {
  const p = (mobile as unknown as Record<MobileSlug, Page>)[slug];
  const hasHeroHeading = p.fallback === null;
  const back = fusion.apps.title;

  return (
    <>
      <section className="brand-mesh-light bg-surface">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-7">
            <Link href={p.back} className="inline-flex min-h-11 items-center text-small font-medium text-teal-ink underline underline-offset-4 hover:text-ink">
              <span aria-hidden>←&nbsp;</span>
              {back}
            </Link>
            <p className="eyebrow mt-6">Mobile</p>
            {hasHeroHeading ? (
              <>
                <p data-scramble className="mt-2 font-display text-display text-depth">
                  {p.name}
                </p>
                <h1 data-reveal className="mt-6 max-w-[24ch] font-display text-h2">
                  {frTypo(p.h1)}
                </h1>
              </>
            ) : (
              <h1 data-reveal className="mt-2 font-display text-display">
                {frTypo(p.h1)}
              </h1>
            )}
            {p.lead && <p className="measure mt-8 text-lead text-ink-2">{frTypo(p.lead)}</p>}
            {p.leadList && (
              <ul className="measure mt-4 grid list-disc gap-2 pl-5 text-ink-2 marker:text-teal-ink">
                {p.leadList.map((x) => (
                  <li key={x}>{frTypo(x)}</li>
                ))}
              </ul>
            )}
            {p.fallback && <p className="measure mt-8 text-lead text-ink-2">{frTypo(p.fallback)}</p>}
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <AssetSlot label={`A-${p.slug} · ${p.name} — capture à fournir`} ratio="9/19" className="mx-auto w-[min(100%,260px)] rounded-lg lg:mx-0" />
          </div>
        </div>
      </section>

      {p.blocks.length > 0 && (
        <section className="section-y">
          <div className="container-x">
            {p.blocks.map((b) => (
              <article key={b.heading} className="grid gap-4 border-t border-hairline py-10 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-16">
                <h2 className="font-display text-h3 lg:col-span-5">{frTypo(b.heading)}</h2>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="max-w-[68ch] text-ink-2">{frTypo(b.body)}</p>
                  {b.list && b.list.length > 0 && (
                    <ul className="mt-6 grid list-disc gap-2 pl-5 text-ink-2 marker:text-teal-ink">
                      {b.list.map((x) => (
                        <li key={x}>{frTypo(x)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="bg-surface-2 py-12">
        <div className="container-x flex flex-wrap items-center justify-between gap-4">
          <Link href={p.back} className="inline-flex min-h-11 items-center font-medium text-teal-ink underline underline-offset-4 hover:text-ink">
            <span aria-hidden>←&nbsp;</span>
            {back}
          </Link>
          <Link href="/contact/" className="btn btn-action">
            Demander une démo
          </Link>
        </div>
      </section>
    </>
  );
}
