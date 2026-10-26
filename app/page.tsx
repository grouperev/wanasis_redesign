import type { Metadata } from "next";
import Link from "next/link";
import { ClientStrip } from "@/components/home/ClientStrip";
import { ModuleCloud } from "@/components/home/ModuleCloud";
import { NewsRail } from "@/components/home/NewsRail";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { AssetSlot } from "@/components/ui/Picture";
import home from "@/lib/content/home.json";
import { firstSentences, frTypo } from "@/lib/format";

export const metadata: Metadata = {
  title: "Wanasis Fusion : L'ERP de choix pour les entreprises en Algérie",
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: "Wanasis Fusion : L'ERP de choix pour les entreprises en Algérie" },
};

// rotating-words (Phase 5): one wheel, landing on the last word.
const WHEEL = ["la distribution", "la production", "la pharmacie", "la santé", "votre activité"];

export default function HomePage() {
  const [fusionLead, fusionRest] = firstSentences(home.solutions.fusion, 2);
  const [lifeLead, lifeRest] = firstSentences(home.solutions.life, 2);

  return (
    <>
      {/* Hero — off-axis split: H1 on a clean ground, photo bleeds right. text-reveal + rotating-words in Phase 5. */}
      <section className="brand-mesh-light relative overflow-hidden">
        <div className="container-x grid items-center gap-10 pt-10 pb-16 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-6 xl:col-span-6">
            <p className="eyebrow">Fusion ERP · Life HIS</p>
            <h1 className="mt-5 text-display">{home.hero.title}</h1>
            <p className="mt-6 font-display text-h3 text-ink-2" aria-label={`ERP pour ${WHEEL.join(", ")}`}>
              ERP pour <span className="text-teal-ink">{WHEEL[WHEEL.length - 1]}</span>
            </p>
            <p className="measure mt-6 text-lead text-ink-2">{home.hero.sub}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contact/" className="btn btn-action">
                Demander une démo
              </Link>
              <Link href="/wanasis-fusion-erp-modules/" className="btn btn-ghost">
                Découvrir Fusion ERP
              </Link>
            </div>
          </div>
          <div className="relative lg:col-span-6 lg:-mr-[calc((100vw-min(100vw-2*var(--gutter),var(--container)))/2)]">
            <AssetSlot
              label="H1 · DG face à l'écran, entrepôt pharmaceutique derrière la vitre"
              className="aspect-[4/5] w-full rounded-lg sm:aspect-[16/11] lg:aspect-auto lg:h-[min(720px,78svh)] lg:rounded-r-none"
            />
          </div>
        </div>
      </section>

      <ClientStrip title={home.clients.title} logos={home.clients.logos} />

      {/* Mission */}
      <section className="section-y">
        <div className="container-x grid gap-8 lg:grid-cols-12">
          <h2 className="text-h2 lg:col-span-5">{frTypo(home.mission.title)}</h2>
          <div className="space-y-5 text-lead text-ink-2 lg:col-span-6 lg:col-start-7">
            {home.mission.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-y bg-surface-2" aria-labelledby="solutions">
        <div className="container-x">
          <h2 id="solutions" className="text-h2">
            {home.solutions.title}
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              { badge: "fusion-erp", name: "Fusion ERP", lead: fusionLead, rest: fusionRest, href: "/wanasis-fusion-erp-modules/", diagram: "schéma des 25 modules Fusion ERP — redessiné en SVG" },
              { badge: "life-his", name: "Life HIS", lead: lifeLead, rest: lifeRest, href: "/wanasis-life-his/", diagram: "schéma des modules Life HIS — redessiné en SVG" },
            ].map((p) => (
              <article key={p.name} className="flex flex-col rounded-lg border border-hairline bg-surface p-6 md:p-10">
                {/* dual-scramble on the product name in Phase 5 */}
                <h3 className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/brand/${p.badge}.png`} alt={p.name} width={200} height={50} className="h-10 w-auto" />
                </h3>
                <p className="mt-6 text-lead">{p.lead}</p>
                {p.rest && (
                  <details className="group mt-3 text-ink-2">
                    <summary className="link cursor-pointer list-none">Lire la suite</summary>
                    <p className="mt-3">{p.rest}</p>
                  </details>
                )}
                <AssetSlot label={p.diagram} className="mt-8 aspect-[4/3] w-full rounded-md" />
                <Link href={p.href} className="btn btn-ghost mt-8 self-start">
                  En savoir plus<span className="sr-only"> sur {p.name}</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ModuleCloud />

      <Stats title={home.stats.title} items={home.stats.items} />

      <Testimonials title={home.testimonials.title} items={home.testimonials.items} />

      <NewsRail title={home.news.title} />

    </>
  );
}
