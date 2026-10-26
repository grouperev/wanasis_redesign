import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type ElasticDividerProps = {
  className?: string;
  color?: string;
  weight?: number;
  frequency?: number;
  damping?: number;
  sensitivity?: number;
  maxAmplitude?: number;
  disable?: string;
};
export type ElasticDividerHandle = { flick: (x?: number, strength?: number, direction?: number) => void; demo: () => unknown };
declare const ElasticDivider: ForwardRefExoticComponent<ElasticDividerProps & RefAttributes<ElasticDividerHandle>>;
export default ElasticDivider;
