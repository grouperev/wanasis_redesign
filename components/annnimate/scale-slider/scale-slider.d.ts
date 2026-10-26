import type { ReactNode } from "react";

export type ScaleSlide = { key: string; href: string; title: string; cover: ReactNode; meta: ReactNode };
declare const ScaleSlider: (props: {
  posts: ScaleSlide[];
  labels: { region: string; prev: string; next: string; status: string };
  onReady?: () => void;
  className?: string;
}) => React.JSX.Element;
export default ScaleSlider;
