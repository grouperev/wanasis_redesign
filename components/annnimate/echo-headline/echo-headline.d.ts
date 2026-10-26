import type { ComponentType, ReactNode } from "react";

declare const EchoHeadline: ComponentType<{
  children: ReactNode;
  className?: string;
  copies?: number;
  depth?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  fade?: "opacity" | "color";
  trigger?: "scrub" | "onEnter";
  scrub?: number;
  hold?: number;
  once?: boolean;
  disable?: string;
  as?: "p" | "h2" | "h3" | "div";
}>;
export default EchoHeadline;
