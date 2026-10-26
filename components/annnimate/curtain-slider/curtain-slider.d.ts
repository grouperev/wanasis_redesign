import type { ReactNode } from "react";

export type CurtainSlide = { key: string; background: ReactNode; content: ReactNode };
export type CurtainLabels = {
  region: string;
  prev: string;
  next: string;
  /** Templates with {i} and {n}. */
  slide: string;
  status: string;
};
declare const CurtainSlider: (props: { slides: CurtainSlide[]; labels: CurtainLabels; className?: string }) => React.JSX.Element;
export default CurtainSlider;
