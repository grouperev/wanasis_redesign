import Link from "next/link";
import { AssetSlot } from "@/components/ui/Picture";
import { ModuleExplorer } from "@/components/fusion/ModuleExplorer";
import { MethodRail } from "@/components/fusion/ProcessRail";
import type { Family, FusionModule } from "@/components/fusion/types";
import content from "@/lib/content/fusion.json";

export const metadata = {
  title: "Wanasis Fusion ERP Modules",
  alternates: { canonical: "/wanasis-fusion-erp-modules/" },
  openGraph: { title: "Wanasis Fusion ERP Modules", url: "/wanasis-fusion-erp-modules/", locale: "fr_FR", type: "article" },
};

const families = content.families as Family[];
const modules = content.modules as FusionModule[];

/** Lead = first two sentences; the remainder stays in the DOM inside a disclosure. */
function splitIntro(text: string): [string, string] {
  const parts = text.split(/(?<=\.)\s+/);
  return [parts.slice(0, 2).join(" "), parts.slice(2).join(" ")];
}

export default function FusionErpPage() {
  const [lead, rest] = splitIntro(content.hero.intro);
  const detailed = modules.filter((m) => m.body);

  return (
    <>
      {/* 1 · Hero */}
      <section className="brand-mesh-light bg-surface">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-7">
            <p className="eyebrow">Fusion ERP</p>
            <h1 data-reveal className="mt-4 font-display text-h1">
              {content.hero.title}
              <br />
              <span className="text-gradient">{content.hero.tagline}</span>
            </h1>
            <p className="mt-6 max-w-[68ch] text-lead text-ink-2">{lead}</p>
            {rest && (
              <details className="group mt-4 max-w-[68ch]">
                <summary className="inline-flex min-h-11 cursor-pointer items-center text-small font-medium text-teal-ink underline underline-offset-4 group-open:hidden">
                  Lire la suite
                </summary>
                <p className="text-ink-2">{rest}</p>
              </details>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact/" className="btn btn-action">
                Demander une démo
              </Link>
              <Link href={content.brochure.url} className="btn btn-ghost">
                {content.brochure.text}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <AssetSlot label="H2 · équipe autour d'un écran" ratio="4/5" className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* 2–4 · Filter, grid, dialog */}
      <ModuleExplorer families={families} modules={modules} />

      <section aria-labelledby="detail-modules" className="container-x pb-20">
        <h2 id="detail-modules" className="eyebrow">
          Modules en détail
        </h2>
        <div className="mt-4 grid border-t border-hairline md:grid-cols-2 md:gap-x-12 [&>article]:border-b [&>article]:border-hairline">
          {detailed.map((m) => (
            <article key={m.slug} id={`detail-${m.slug}`}>
              <details className="py-2">
                <summary className="flex min-h-11 cursor-pointer items-center">
                  <h3 className="font-display text-h3">{m.name}</h3>
                </summary>
                <p className="max-w-[68ch] pb-4 text-ink-2">{m.body}</p>
              </details>
            </article>
          ))}
        </div>
      </section>

      {/* 5 · Complète et modulaire — process-rail runs full width under the copy */}
      <section className="section-y bg-surface-2">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-16">
            <h2 className="font-display text-h2 lg:col-span-5">{content.complete.title}</h2>
            <p className="measure text-ink-2 lg:col-span-6 lg:col-start-7">{content.complete.body}</p>
          </div>
          <MethodRail className="mt-12 md:mt-16" />
        </div>
      </section>

      {/* 6 · Applications mobiles */}
      <section id="apps-mobiles" className="on-dark section-y bg-depth text-white">
        <div className="container-x">
          <h2 className="max-w-[24ch] font-display text-h2">{content.apps.title}</h2>
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {content.apps.items.map((a) => (
              <li key={a.slug} className="grid gap-6 rounded-md border border-hairline-dark p-6 sm:grid-cols-[160px_1fr] md:p-8">
                <AssetSlot label={`A-${a.slug} · ${a.name} — capture à fournir`} ratio="9/19" className="w-[140px] rounded-lg sm:w-full" />
                <div className="flex flex-col">
                  <p className="eyebrow !text-teal">Mobile</p>
                  <h3 data-scramble className="mt-1 font-display text-h2">
                    {a.name}
                  </h3>
                  <p className="mt-4 text-white/80">{a.body}</p>
                  <Link href={a.href} className="mt-auto inline-flex min-h-11 items-center pt-4 font-medium underline underline-offset-4 hover:text-teal">
                    En savoir plus<span className="sr-only"> : {a.name}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </>
  );
}
