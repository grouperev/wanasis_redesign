import ProcessRail from "@/components/annnimate/process-rail/process-rail";

// OQ-11 placeholder method; every step stays flagged until the client confirms it.
const STEPS = ["Audit", "Paramétrage", "Migration", "Formation", "Go-live", "Support"] as const;
const TAG = "[à valider]";

/** Six-step implementation method on the Annnimate process-rail. `ground` = the section background the bead's halo blends into. */
export function MethodRail({ ground = "var(--color-surface-2)", className }: { ground?: string; className?: string }) {
  return (
    <div style={{ "--prl-ground": ground } as React.CSSProperties} className={className}>
      <ProcessRail steps={STEPS.map((title) => ({ title, tag: TAG }))} label="Méthode de mise en œuvre" />
    </div>
  );
}
