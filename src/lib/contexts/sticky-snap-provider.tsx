import { useLenis } from "lenis/react";
import { easeOut, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import { StickySnapContext, type SnapSection } from "./use-sticky-snap";

export function StickySnapProvider({
  snapThreshold = 100,
  duration = 0.8,
  snapTopBottom = true,
  children,
}: {
  snapThreshold?: number;
  duration?: number;
  snapTopBottom?: boolean;
  children: React.ReactNode;
}) {
  const lenis = useLenis();

  const sectionsRef = useRef<SnapSection[]>([]);
  const snappingRef = useRef(false);
  const lockedSnapRef = useRef(false);
  const lastScrollRef = useRef(0);
  const activeElement = useRef<HTMLElement>(null);

  const lockedScrollRef = useRef(false);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const activeIndex = useMotionValue(0);
  const isSnapping = useMotionValue<0 | 1>(0);

  const registerSection = useCallback(
    (
      el: RefObject<HTMLElement | null>,
      options: { offset?: number } = { offset: 0 },
    ) => {
      if (!el) return;
      const offset = options?.offset ?? 0;
      const exists = sectionsRef.current.some((s) => s.el === el.current);
      if (!exists) {
        sectionsRef.current.push({ el: el.current, offset });
      }
    },
    [],
  );

  const lockSnap = useCallback(() => {
    lockedSnapRef.current = true;
  }, []);

  const unlockSnap = useCallback(() => {
    lockedSnapRef.current = false;
  }, []);

  const lockScroll = useCallback(() => {
    // Cancel any in-flight snap
    if (snappingRef.current) {
      snappingRef.current = false;
      isSnapping.set(0);
      clearTimeout(snapTimeoutRef.current);
    }

    // Lock both snap and scroll
    lockedSnapRef.current = true;
    lockedScrollRef.current = true;

    // Stop Lenis entirely — no input processing, no scroll events,
    // no scrollTo feedback loop
    lenis?.stop();
  }, [lenis, isSnapping]);

  const unlockScroll = useCallback(() => {
    lockedScrollRef.current = false;
    lockedSnapRef.current = false;

    // Resume Lenis from the preserved position
    lenis?.start();
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ scroll }: { scroll: number }) => {
      // Always keep tracking current position
      const prevScroll = lastScrollRef.current;
      lastScrollRef.current = scroll;

      // Lenis is stopped during lock, but guard anyway
      if (lockedScrollRef.current) return;
      if (snappingRef.current) return;
      if (lockedSnapRef.current) return;

      const scrollingDown = scroll > prevScroll;

      if (!scrollingDown && !snapTopBottom) return;

      for (let i = 0; i < sectionsRef.current.length; i++) {
        const { el, offset } = sectionsRef.current[i];
        const rect = el?.getBoundingClientRect();
        if (!rect) return;

        if (scrollingDown && rect.top > 0 && rect.top < snapThreshold) {
          const targetY = scroll + rect.top - offset;

          snappingRef.current = true;
          activeIndex.set(i);
          activeElement.current = sectionsRef.current[i].el;
          isSnapping.set(1);

          lenis.scrollTo(targetY, {
            duration,
            easing: easeOut,
          });

          snapTimeoutRef.current = setTimeout(
            () => {
              snappingRef.current = false;
              isSnapping.set(0);
            },
            duration * 1000 + 80,
          );

          break;
        }
      }
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, snapThreshold, duration, snapTopBottom, activeIndex, isSnapping]);

  return (
    <StickySnapContext.Provider
      value={{
        registerSection,
        lockSnap,
        unlockSnap,
        lockScroll,
        unlockScroll,
        activeIndex,
        isSnapping,
        sectionsRef,
        activeElement,
      }}
    >
      {children}
    </StickySnapContext.Provider>
  );
}
