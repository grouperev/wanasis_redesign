import CurtainSlider from "@/components/annnimate/curtain-slider/curtain-slider";
import { Picture } from "@/components/ui/Picture";
import { logoFile } from "@/lib/clients";
import { frTypo } from "@/lib/format";

type T = { quote: string; name: string; role: string; company: string };

// The quoted client's own logo (from the Références wall) — no stock scene behind a testimonial.
const LOGOS: Record<string, string> = {
  "Groupe Attiryak": "attiryak.jpg",
  Biogalenic: "biogalenic.jpg",
  "Chark Pharm": "chark-pharm.jpg",
  "Clinique Avicenne": "bg-avicenne.jpg",
};

const LABELS = {
  prev: "Témoignage précédent",
  next: "Témoignage suivant",
  slide: "{i} sur {n}",
  status: "Témoignage {i} sur {n}",
};

/** Testimonials on the curtain-slider: one slide per client, quote / name / role / company verbatim. */
export function Testimonials({ title, items }: { title: string; items: T[] }) {
  const slides = items.map((t) => ({
    key: t.company,
    background: <div aria-hidden className="brand-mesh size-full" />,
    content: (
      <figure className="max-w-[52rem]">
        <span aria-hidden className="block h-[0.45em] font-sans text-[clamp(5rem,3rem+6vw,8rem)] font-semibold leading-none text-teal">
          “
        </span>
        <blockquote className="mt-2 text-lead text-white md:text-[1.625rem] md:leading-[1.5]">
          <p>{frTypo(t.quote)}</p>
        </blockquote>
        <figcaption className="mt-10 flex items-center gap-5 border-t border-hairline-dark pt-6">
          {LOGOS[t.company] && (
            <span className="grid size-20 shrink-0 place-items-center rounded-md bg-white p-2.5 md:size-24">
              <Picture
                src={logoFile(LOGOS[t.company])}
                alt={t.company}
                sizes="96px"
                placeholder={false}
                className="block size-full"
                imgClassName="size-full object-contain mix-blend-multiply contrast-125 brightness-110"
              />
            </span>
          )}
          <span>
            <span className="block font-display text-h3">{t.name}</span>
            <span className="text-white/80">
              {t.role}, {t.company}
            </span>
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
