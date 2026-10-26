/** Static state of the split-flap-board (Phase 5). The real numbers are always the DOM text. */
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
              <dd className="text-gradient order-1 pb-1 font-display text-[clamp(4rem,2.5rem+6vw,8rem)] leading-none tabular-nums tracking-[-0.02em]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
