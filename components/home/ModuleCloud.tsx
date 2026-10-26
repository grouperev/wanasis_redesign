import Link from "next/link";
import fusion from "@/lib/content/fusion.json";

const FAMILY_BG: Record<string, string> = {
  commercial: "bg-fam-commercial",
  finance: "bg-fam-finance",
  supply: "bg-fam-supply",
  rh: "bg-fam-rh",
  digital: "bg-fam-digital",
};

/** Static fallback of the magnetic-tag-cloud (Phase 5). Every tag deep-links to its module. */
export function ModuleCloud() {
  return (
    <section className="section-y" aria-labelledby="modules">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="modules" className="text-h2 lg:col-span-6">
            Vous êtes unique, <span className="text-gradient">c’est pourquoi Fusion ERP est riche, flexible et entièrement modulaire.</span>
          </h2>
        </div>
        <ul className="mt-12 flex flex-wrap justify-center gap-2.5 md:gap-3">
          {fusion.modules.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/wanasis-fusion-erp-modules/#${m.slug}`}
                className={`${FAMILY_BG[m.family]} inline-flex min-h-11 items-center gap-2.5 rounded-sm px-4 font-display text-[1.0625rem] text-white transition-transform duration-150 hover:-translate-y-0.5 md:min-h-13 md:px-5 md:text-lead`}
              >
                {m.chip && <span aria-hidden className="h-4 w-1 rounded-full" style={{ backgroundColor: m.chip }} />}
                {m.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-small text-ink-2">
          {fusion.families.map((f) => (
            <li key={f.id} className="flex items-center gap-2">
              <span aria-hidden className={`size-2.5 rounded-full ${FAMILY_BG[f.id]}`} />
              {f.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
