import type { Metadata } from "next";
import Link from "next/link";
import { LifeMatrix, type MatrixGroup } from "@/components/product/LifeMatrix";
import { Photo, Picture } from "@/components/ui/Picture";
import life from "@/lib/content/life.json";
import { frTypo } from "@/lib/format";

export const metadata: Metadata = {
  title: life.meta.title,
  alternates: { canonical: life.meta.canonical },
  openGraph: { title: life.meta.title, url: life.meta.canonical, locale: "fr_FR", type: "article" },
};

const groups = life.groups as MatrixGroup[];

export default function LifeHisPage() {
  const t = life.testimonial;
  return (
    <>
      {/* 1 · Hero — type-led, no stock photo */}
      <section className="brand-mesh-light bg-surface">
        <div className="container-x py-16 lg:py-28">
          <div className="flex items-center gap-4">
            <Picture src="life-his.png" alt="" sizes="160px" priority placeholder={false} className="shrink-0" imgClassName="h-auto w-40" />
            <p data-scramble className="eyebrow">
              Life HIS
            </p>
          </div>
          <h1 data-reveal className="mt-8 max-w-[22ch] font-display text-h1 lg:max-w-[20ch]">
            {frTypo(life.hero.title)}
          </h1>
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-16">
            <p className="text-lead lg:col-span-5">{frTypo(life.hero.lead)}</p>
            <p className="measure text-ink-2 lg:col-span-6 lg:col-start-7">{frTypo(life.hero.intro[0])}</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact/" className="btn btn-action">
              Demander une démo
            </Link>
            <Link href="/contact/" className="btn btn-ghost">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* 2 · Accordion matrix */}
      <section className="section-y">
        <div className="container-x">
          <LifeMatrix groups={groups} />
        </div>
      </section>

      {/* 3 · Scenes — asymmetric trio */}
      <section aria-label="Scènes" className="bg-surface-2 py-[var(--section-y)]">
        <div className="container-x grid gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-6">
          <Photo shot="L1" sizes="(min-width: 1024px) 58vw, 100vw" label="L1 · accueil de clinique" className="aspect-[3/2] rounded-lg lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[420px]" />
          <Photo shot="L2" sizes="(min-width: 1024px) 40vw, 100vw" label="L2 · poste infirmier, tablette" ratio="3/2" className="rounded-lg lg:col-span-5" />
          <Photo shot="L3" sizes="(min-width: 1024px) 40vw, 100vw" label="L3 · réserve de pharmacie hospitalière" ratio="3/2" className="rounded-lg lg:col-span-5" />
        </div>
      </section>

      {/* 4 · Testimonial — verbatim */}
      <section className="section-y" aria-label={t.company}>
        <figure className="container-x grid gap-8 lg:grid-cols-12">
          <blockquote className="border-l-4 border-teal-ink pl-6 font-display text-h3 lg:col-span-9 lg:pl-10">
            <p className="text-balance">{t.quote}</p>
          </blockquote>
          <figcaption className="text-small text-ink-2 lg:col-span-9 lg:col-start-1 lg:pl-10">
            <span className="block font-medium text-ink">{t.name}</span>
            {t.role} · {t.company}
          </figcaption>
        </figure>
      </section>

      {/* 5 · CTA band */}
      <section className="brand-mesh on-dark section-y text-white">
        <div className="container-x grid gap-8 lg:grid-cols-12 lg:items-end">
          <p className="max-w-[60ch] font-display text-h3 lg:col-span-8">{frTypo(life.hero.intro[1])}</p>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <Link href="/contact/" className="btn btn-action">
              Demander une démo
            </Link>
            <Link href="/contact/" className="btn btn-ghost">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
