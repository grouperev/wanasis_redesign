import type { ComponentType, ReactNode } from "react";

declare const AccordionItem: ComponentType<{
  open: boolean;
  onToggle: () => void;
  title: ReactNode;
  children?: ReactNode;
  titleLabel?: string;
}>;
export default AccordionItem;
