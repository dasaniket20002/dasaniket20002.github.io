import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  children: ReactNode;
  container?: Element | null;
}

export default function Portal({ children, container }: PortalProps) {
  return createPortal(children, container ?? document.body);
}
