import type { MotionValue } from "motion/react";
import { createContext, useContext, type RefObject } from "react";

export type SnapSection = {
  el: HTMLElement | null;
  offset: number;
};

export type StickySnapContextValue = {
  registerSection: (
    el: RefObject<HTMLElement | null>,
    options?: { offset?: number },
  ) => void;
  lockSnap: () => void;
  unlockSnap: () => void;
  lockScroll: () => void;
  unlockScroll: () => void;
  activeIndex: MotionValue<number>;
  isSnapping: MotionValue<0 | 1>;
  sectionsRef: RefObject<SnapSection[]>;
  activeElement: RefObject<HTMLElement | null>;
};

export const StickySnapContext = createContext<StickySnapContextValue | null>(
  null,
);

export function useStickySnap() {
  const ctx = useContext(StickySnapContext);
  if (!ctx) {
    throw new Error("useStickySnap must be used within StickySnapProvider");
  }
  return ctx;
}
