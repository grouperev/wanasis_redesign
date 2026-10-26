import { Picture } from "@/components/ui/Picture";
import { clientName } from "@/lib/clients";

/** Trust strip. v0: static scroll row; Phase 5: slow CSS marquee (pauses on hover/focus, static under reduced motion). */
export function ClientStrip({ title, logos }: { title: string; logos: string[] }) {
  return (
    <section aria-labelledby="clients" className="border-y border-hairline bg-surface">
      <div className="container-x flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:gap-12">
        <h2 id="clients" className="shrink-0 font-display text-small uppercase tracking-[0.08em] text-ink-2">
          {title}
        </h2>
        <ul className="-mx-[var(--gutter)] flex snap-x gap-3 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:px-0 [scrollbar-width:thin]">
          {logos.map((f) => (
            <li key={f} className="shrink-0 snap-start">
              <div className="grid size-24 place-items-center rounded-md bg-surface-2 p-2 md:size-28">
                <Picture
                  src={f}
                  alt={clientName(f)}
                  sizes="112px"
                  placeholder={false}
                  imgClassName="size-full object-contain mix-blend-multiply grayscale transition duration-300 hover:grayscale-0"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
