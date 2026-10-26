import type { Metadata } from "next";
import Link from "next/link";
import { ModuleDiagram } from "@/components/product/ModuleDiagram";
import type { Family, FusionModule } from "@/components/fusion/types";
import { Picture } from "@/components/ui/Picture";
import page from "@/lib/content/fusion-algerie.json";
import fusion from "@/lib/content/fusion.json";
import { frTypo } from "@/lib/format";

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: page.meta.canonical },
  openGraph: {
    title: page.meta.title,
    description: page.meta.description,
    url: page.meta.canonical,
    locale: "fr_FR",
    type: "article",
  },
};

const families = fusion.families as Family[];
const modules = fusion.modules as FusionModule[];

export default function ErpAlgerieFusionPage() {
  return (
    <>
      {/* 1 · Hero */}
      <section className="brand-mesh-light bg-surface">
        <div className="container-x py-16 lg:py-28">
          <Picture src="fusion-erp.png" alt="Fusion ERP" sizes="160px" priority placeholder={false} imgClassName="h-auto w-40" />
          <h1 data-reveal className="mt-8 max-w-[22ch] font-display text-h1">
            {frTypo(page.hero.title)}
          </h1>
          <p className="mt-6 max-w-[48ch] font-display text-h3 text-ink-2">{frTypo(page.hero.lead)}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact/" className="btn btn-action">
              Demander une démo
            </Link>
            <Link href={page.brochure.url} className="btn btn-ghost">
              {page.brochure.text}
            </Link>
          </div>
        </div>
      </section>

      {/* 2 · Copy beside the module diagram */}
      <section className="section-y bg-surface-2">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="measure text-ink-2">{frTypo(page.hero.body)}</p>
            <Link
              href="/wanasis-fusion-erp-modules/"
              className="mt-8 inline-flex min-h-11 items-center font-medium text-teal-ink underline underline-offset-4 hover:text-ink"
            >
              En savoir plus<span className="sr-only"> : Fusion ERP</span>
              <span aria-hidden>&nbsp;→</span>
            </Link>
          </div>
          <div className="lg:col-span-7">
            <ModuleDiagram families={families} modules={modules} />
          </div>
        </div>
      </section>

      {/* 3 · Mobile apps */}
      <section className="section-y" aria-labelledby="apps">
        <div className="container-x">
          <h2 id="apps" className="max-w-[24ch] font-display text-h2">
            {page.apps.title}
          </h2>
          <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {page.apps.items.map((a) => (
              <li key={a.slug} className="border-t border-hairline pt-6">
                <h3 data-scramble className="font-display text-h3">
                  {a.name}
                </h3>
                <p className="mt-3 max-w-[68ch] text-ink-2">{frTypo(a.body)}</p>
                <Link href={a.href} className="mt-4 inline-flex min-h-11 items-center font-medium text-teal-ink underline underline-offset-4 hover:text-ink">
                  En savoir plus<span className="sr-only"> : {a.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 · CTA band */}
      <section className="brand-mesh on-dark py-16 text-white md:py-20">
        <div className="container-x flex flex-wrap justify-center gap-3">
          <Link href="/contact/" className="btn btn-action">
            Demander une démo
          </Link>
          <Link href={page.brochure.url} className="btn btn-ghost">
            {page.brochure.text}
          </Link>
        </div>
      </section>
    </>
  );
}
