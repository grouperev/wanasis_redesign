import type { RefObject } from "react";
import type { NavItem } from "@/lib/site";

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  cta: { label: string; href: string };
  pathname: string;
  toggleRef?: RefObject<HTMLElement | null>;
  id?: string;
};
declare const MultiLevelDrawerMenu: (props: DrawerProps) => React.JSX.Element;
export default MultiLevelDrawerMenu;
