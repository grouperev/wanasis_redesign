import { firstSentences } from "@/lib/format";
import { LogoWall, type WallItem } from "@/components/proof/LogoWall";
import ImageFlyIn from "@/components/annnimate/image-fly-in/image-fly-in";
import { Picture } from "@/components/ui/Picture";
import { pageMetadata } from "@/components/news/meta";
import content from "@/lib/content/reference.json";
import { clientName, logoFile } from "@/lib/clients";
import { photo } from "@/lib/photos";
import { frTypo } from "@/lib/format";

export const metadata = pageMetadata({ title: content.meta.title, route: content.meta.route, description: content.meta.description ?? firstSentences(content.paragraphs[0], 1)[0] });

const collator = new Intl.Collator("fr");

// white-bg.png on the old wall is an empty placeholder tile, not a client.
const LOGOS = content.logos.filter((f) => f !== "white-bg.png");

export default function ReferencePage() {
  // Fly-in: the approved photography interleaved with clean client logos. Eager-loaded: lazy images inside
  // the 3D field are never "in view" for the browser and stayed blank.
  // FLY-* are second-choice variants shown nowhere else on the site (no image is repeated).
  const shots = Array.from({ length: 11 }, (_, i) => `FLY-${String(i + 1).padStart(2, "0")}`);
  const clean = LOGOS.filter((f) => logoFile(f) !== f);
  let nextShot = 0;
  let nextLogo = 0;
  const cards = Array.from({ length: 16 }, (_, i) => {
    const isPhoto = i % 3 !== 2 && nextShot < shots.length;
    const ph = isPhoto ? photo(shots[nextShot++]) : null;
    const logo = clean[(nextLogo++ * 7) % clean.length];
    return {
      aspect: (i % 3 === 0 ? "square_lg" : "square_sm") as "square_lg" | "square_sm",
      hideMobile: i % 2 === 1,
      node: ph ? (
        <Picture src={ph.src} alt="" sizes="320px" priority className="block size-full" imgClassName="size-full object-cover" />
      ) : (
        <span className="grid size-full place-items-center bg-white p-6">
          <Picture src={logoFile(logo)} alt="" sizes="200px" priority placeholder={false} className="block size-full" imgClassName="size-full object-contain" />
        </span>
      ),
    };
  });

  const wall: WallItem[] = LOGOS
    .map((file) => ({ file, name: clientName(file) }))
    .sort((a, b) => collator.compare(a.name, b.name))
    .map(({ file, name }) => ({
      file,
      name,
      logo: (
        <Picture
          src={logoFile(file)}
          alt=""
          sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 45vw"
          placeholder={false}
          className="block size-full"
          imgClassName="logo-cell_img size-full object-contain"
        />
      ),
    }));

  return (
    <>
      <ImageFlyIn cards={cards}>
        <div className="text-center">
          <h1 data-reveal className="font-display text-h1">
            {frTypo(content.h1)}
          </h1>
          {content.paragraphs.map((p, i) => (
            <p key={i} className={`mx-auto mt-6 max-w-[60ch] text-white/85 ${i === 0 ? "text-lead" : ""}`}>
              {frTypo(p)}
            </p>
          ))}
        </div>
      </ImageFlyIn>

      <section className="section-y bg-surface" aria-label={content.h1}>
        <div className="container-x">
          <LogoWall items={wall} />
        </div>
      </section>
    </>
  );
}
