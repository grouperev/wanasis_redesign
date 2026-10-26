import SplitFlapValue from "@/components/annnimate/split-flap-board/split-flap-board";

/**
 * Stats on split-flap tiles. The real number is the text of each <dd> (screen readers, copy, no-JS); the flap tiles are a
 * decorative aria-hidden rendering of the same value that flaps from blank once when it scrolls into view.
 */
export function Stats({ title, items }: { title: string; items: { value: string; label: string }[] }) {
  return (
    <section className="brand-mesh-light border-b border-hairline" aria-labelledby="chiffres">
      <div className="container-x py-20 md:py-28">
        <h2 id="chiffres" className="eyebrow">
          {title}
        </h2>
        <dl className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {items.map((s) => (
            <div key={s.label} className="flex flex-col border-t border-hairline pt-6">
              <dt className="order-2 mt-3 text-lead text-ink-2">{s.label}</dt>
              <dd className="order-1 pb-1 font-display text-[clamp(2.75rem,1.5rem+4vw,5.5rem)] leading-none tabular-nums tracking-[-0.02em]">
                <span className="sr-only">{s.value}</span>
                <SplitFlapValue value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
