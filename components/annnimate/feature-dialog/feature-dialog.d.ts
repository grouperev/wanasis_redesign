import type { ComponentType, ReactNode } from "react";

declare const FeatureDialog: ComponentType<{
  open: boolean;
  onClose: () => void;
  onClosed?: () => void;
  titleId: string;
  closeLabel?: string;
  accent?: string;
  children?: ReactNode;
}>;
export default FeatureDialog;
