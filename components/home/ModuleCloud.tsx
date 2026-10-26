import MagneticTagCloud from "@/components/annnimate/magnetic-tag-cloud/magnetic-tag-cloud";
import fusion from "@/lib/content/fusion.json";

const FAMILY_BG: Record<string, string> = {
  commercial: "bg-fam-commercial",
  finance: "bg-fam-finance",
  supply: "bg-fam-supply",
  rh: "bg-fam-rh",
  digital: "bg-fam-digital",
};

/**
 * The 26 Fusion ERP modules on the magnetic-tag-cloud. Without a fine pointer (touch, keyboard-only, reduced motion) or JS
 * it is a centred, wrapping list of links; every tag deep-links to its module either way.
 */
export function ModuleCloud() {
  const tags = fusion.modules.map((m) => ({
    label: m.name,
    href: `/wanasis-fusion-erp-modules/#${m.slug}`,
    className: FAMILY_BG[m.family],
    chip: m.chip || undefined,
  }));
  return (
    <section className="section-y" aria-labelledby="modules">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="modules" className="text-h2 lg:col-span-6">
            Vous êtes unique, <span className="text-gradient">c’est pourquoi Fusion ERP est riche, flexible et entièrement modulaire.</span>
          </h2>
        </div>
        <div className="mt-12">
          <MagneticTagCloud tags={tags} />
        </div>
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
