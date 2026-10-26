import { LogoWall, type WallItem } from "@/components/proof/LogoWall";
import ImageFlyIn from "@/components/annnimate/image-fly-in/image-fly-in";
import { Picture } from "@/components/ui/Picture";
import { pageMetadata } from "@/components/news/meta";
import content from "@/lib/content/reference.json";
import { clientName, logoFile } from "@/lib/clients";
import { frTypo } from "@/lib/format";

export const metadata = pageMetadata({ title: content.meta.title, route: content.meta.route, description: content.meta.description });

const collator = new Intl.Collator("fr");

// white-bg.png on the old wall is an empty placeholder tile, not a client.
const LOGOS = content.logos.filter((f) => f !== "white-bg.png");

export default function ReferencePage() {
  // Fly-in: a spread of 16 logos across the whole list; the full set is in the wall below.
  const step = LOGOS.length / 16;
  const flying = Array.from({ length: 16 }, (_, i) => LOGOS[Math.floor(i * step)]);
  const cards = flying.map((file, i) => ({
    aspect: (i % 3 === 0 ? "square_lg" : "square_sm") as "square_lg" | "square_sm",
    hideMobile: i % 2 === 1,
    node: (
      <Picture src={logoFile(file)} alt="" sizes="200px" placeholder={false} className="block size-full" imgClassName="size-full object-contain" />
    ),
  }));

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
          imgClassName="size-full object-contain mix-blend-multiply grayscale transition duration-300 group-hover:grayscale-0 group-focus-within:grayscale-0"
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
