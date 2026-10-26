import type { Metadata } from "next";
import EchoHeadline from "@/components/annnimate/echo-headline/echo-headline";
import { MethodRail } from "@/components/fusion/ProcessRail";
import { AssetSlot, Picture } from "@/components/ui/Picture";
import societe from "@/lib/content/societe.json";
import { frTypo } from "@/lib/format";

export const metadata: Metadata = {
  title: societe.meta.title,
  description: societe.meta.description,
  alternates: { canonical: societe.meta.canonical },
  openGraph: {
    title: societe.meta.title,
    description: societe.meta.description,
    url: societe.meta.canonical,
    locale: "fr_FR",
    type: "article",
  },
};

export default function SocietePage() {
  return (
    <>
      {/* 1 · Hero — the quote is the page's H1 */}
      <section className="brand-mesh-light bg-surface">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-7">
            <h1 data-reveal className="font-display text-h1">
              {frTypo(societe.quote)}
            </h1>
            <p className="measure mt-8 text-lead text-ink-2">{frTypo(societe.intro)}</p>
          </div>
          <div className="lg:col-span-5">
            <AssetSlot label="H3 · pièces de puzzle, bleu · turquoise · rouge" ratio="3/2" className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* 2 · One signature headline */}
      <section aria-hidden className="overflow-x-clip bg-surface">
        <div className="container-x">
          <EchoHeadline as="p" copies={8} depth={1} rotateX={20} rotateY={20} trigger="onEnter" once>
            {societe.echo}
          </EchoHeadline>
        </div>
      </section>

      {/* 3 · Directors — a roster, not a zigzag */}
      <section className="section-y" aria-label="Direction">
        <ul className="container-x grid gap-4">
          {societe.directors.map((d) => (
            <li key={d.slug}>
              <article className="grid gap-6 rounded-md border border-hairline p-6 md:grid-cols-[180px_1fr] md:gap-10 md:p-8 lg:grid-cols-[180px_minmax(0,1fr)_minmax(0,1.4fr)]">
                <Picture
                  src={d.portrait}
                  alt={d.name}
                  sizes="180px"
                  className="block w-[120px] overflow-hidden rounded-md bg-surface-2 sm:w-[180px]"
                  imgClassName="block h-auto w-full"
                />
                <div className="flex flex-col">
                  <h2 className="font-display text-h3">{d.name}</h2>
                  <p className="eyebrow mt-2">{d.title}</p>
                  <a
                    href={d.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-11 items-center pt-4 text-small font-medium text-teal-ink underline underline-offset-4 hover:text-ink"
                  >
                    LinkedIn<span className="sr-only"> : {d.name}</span>
                  </a>
                </div>
                <p className="max-w-[68ch] text-ink-2 md:col-span-2 lg:col-span-1">{frTypo(d.bio)}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 · Partner text + method rail */}
      <section className="section-y bg-surface-2">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
            <h2 className="font-display text-h2 lg:col-span-5">{frTypo(societe.partner.title)}</h2>
            <div className="grid gap-5 lg:col-span-6 lg:col-start-7">
              {societe.partner.paras.map((p) => (
                <p key={p} className="max-w-[68ch] text-ink-2">
                  {frTypo(p)}
                </p>
              ))}
            </div>
          </div>
          <MethodRail className="mt-16" />
        </div>
      </section>
    </>
  );
}
