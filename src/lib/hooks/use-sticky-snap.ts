import type { MotionValue } from "motion/react";
import { createContext, useContext } from "react";

export type SnapSection = {
  el: HTMLElement;
  offset: number;
};

export type StickySnapContextValue = {
  registerSection: (
    el: HTMLElement | null,
    options?: { offset?: number }
  ) => void;
  lockSnap: () => void;
  unlockSnap: () => void;
  activeIndex: MotionValue<number>;
  isSnapping: MotionValue<0 | 1>;
  sectionsRef: React.RefObject<SnapSection[]>;
  activeElement: React.RefObject<HTMLElement | null>;
};

export const StickySnapContext = createContext<StickySnapContextValue | null>(
  null
);

export function useStickySnap() {
  const ctx = useContext(StickySnapContext);
  if (!ctx) {
    throw new Error("useStickySnap must be used within StickySnapProvider");
  }
  return ctx;
}
