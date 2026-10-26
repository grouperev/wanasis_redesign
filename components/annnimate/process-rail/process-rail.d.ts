import type { ComponentType } from "react";

export type ProcessStep = { num?: string; title: string; tag?: string };

declare const ProcessRail: ComponentType<{
  className?: string;
  steps: ProcessStep[];
  scrub?: number;
  beadSize?: number;
  label?: string;
}>;
export default ProcessRail;
