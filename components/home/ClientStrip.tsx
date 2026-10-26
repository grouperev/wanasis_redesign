import { Picture } from "@/components/ui/Picture";
import { clientName, logoFile } from "@/lib/clients";
import { MarqueeFrame } from "./MarqueeFrame";
import "./marquee.css";

/**
 * Trust strip: slow CSS marquee (no JS needed), the list duplicated once with aria-hidden on the clone.
 * Pauses on hover, focus and via the button; under reduced motion it is a static scroll row.
 */
export function ClientStrip({ title, logos }: { title: string; logos: string[] }) {
  const tile = (f: string, clone: boolean) => (
    <li key={`${clone ? "c-" : ""}${f}`} className="marquee_item" aria-hidden={clone || undefined}>
      <div className="grid size-24 place-items-center rounded-md bg-surface-2 p-2 md:size-28">
        <Picture
          src={logoFile(f)}
          alt={clone ? "" : clientName(f)}
          sizes="112px"
          placeholder={false}
          imgClassName="size-full object-contain mix-blend-multiply grayscale transition duration-300 hover:grayscale-0"
        />
      </div>
    </li>
  );
  return (
    <section aria-labelledby="clients" className="border-y border-hairline bg-surface">
      <div className="container-x flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:gap-12">
        <h2 id="clients" className="shrink-0 font-display text-small uppercase tracking-[0.08em] text-ink-2">
          {title}
        </h2>
        <MarqueeFrame>
          <ul className="marquee_track">
            {logos.map((f) => tile(f, false))}
            {logos.map((f) => tile(f, true))}
          </ul>
        </MarqueeFrame>
      </div>
    </section>
  );
}
