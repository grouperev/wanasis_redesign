const STEPS = ["Audit", "Paramétrage", "Migration", "Formation", "Go-live", "Support"] as const;

/** Static placeholder; the Annnimate process-rail replaces the inner list in Phase 5. */
export function ProcessRail() {
  return (
    <ol className="ml-1 border-l border-teal">
      {STEPS.map((s, i) => (
        <li key={s} className="relative flex flex-wrap items-baseline gap-x-3 pb-8 pl-6 last:pb-0">
          <span aria-hidden className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-teal-ink" />
          <span className="font-display text-small tabular-nums text-ink-2">{String(i + 1).padStart(2, "0")}</span>
          <span className="font-display text-h3">{s}</span>
          <span className="text-small text-action">[à valider]</span>
        </li>
      ))}
    </ol>
  );
}
