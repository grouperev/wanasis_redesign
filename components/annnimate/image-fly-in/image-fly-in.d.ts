import type { ReactNode } from "react";

export type FlyInCard = { node: ReactNode; aspect: "square_sm" | "square_lg"; hideMobile?: boolean };

export interface ImageFlyInProps {
  className?: string;
  cards?: FlyInCard[];
  children?: ReactNode;
  duration?: number;
  depth?: number;
  speed?: number;
  scrollBoost?: number;
  pan?: number;
  holeBuffer?: number;
}

export default function ImageFlyIn(props: ImageFlyInProps): ReactNode;
