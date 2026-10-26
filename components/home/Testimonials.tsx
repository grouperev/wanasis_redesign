import CurtainSlider from "@/components/annnimate/curtain-slider/curtain-slider";
import { AssetSlot, Picture } from "@/components/ui/Picture";
import { frTypo } from "@/lib/format";

/** `image` is the Phase 4 hook: a manifest file name (see Picture). Until then the slide shows its T1-T4 slot. */
type T = { quote: string; name: string; role: string; company: string; image?: string };

// Ambient industry backdrops (T1-T4). Never a person standing in for the quoted client.
const SCENES = ["T1 · hub de distribution", "T2 · ligne de production", "T3 · quai logistique", "T4 · couloir de clinique"];

const LABELS = {
  prev: "Témoignage précédent",
  next: "Témoignage suivant",
  slide: "{i} sur {n}",
  status: "Témoignage {i} sur {n}",
};

/** Testimonials on the curtain-slider: one slide per client, quote / name / role / company verbatim. */
export function Testimonials({ title, items }: { title: string; items: T[] }) {
  const slides = items.map((t, i) => ({
    key: t.company,
    background: t.image ? (
      <Picture src={t.image} alt="" sizes="100vw" placeholder={false} className="block size-full" imgClassName="size-full object-cover" />
    ) : (
      <AssetSlot label={SCENES[i % SCENES.length]} className="size-full place-items-end pr-[6%] pb-[14%] max-lg:hidden" />
    ),
    content: (
      <figure className="max-w-[46rem]">
        <blockquote className="text-lead text-white md:text-[1.5rem] md:leading-[1.5]">
          <p>{frTypo(`« ${t.quote} »`)}</p>
        </blockquote>
        <figcaption className="mt-8 border-t border-hairline-dark pt-6">
          <span className="block font-display text-h3">{t.name}</span>
          <span className="text-white/80">
            {t.role}, {t.company}
          </span>
        </figcaption>
      </figure>
    ),
  }));

  return (
    <section className="on-dark relative bg-depth text-white" aria-labelledby="temoignages">
      <div className="container-x pt-20 pb-10 md:pt-28">
        <h2 id="temoignages" className="text-h2">
          {title}
        </h2>
      </div>
      <CurtainSlider slides={slides} labels={{ ...LABELS, region: title }} />
    </section>
  );
}
