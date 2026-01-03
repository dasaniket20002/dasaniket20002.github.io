import { useLenis } from "lenis/react";
import { easeOut, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { StickySnapContext, type SnapSection } from "../hooks/use-sticky-snap";

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
  const programmaticScrollRef = useRef(false);
  const lastScrollRef = useRef(0);
  const activeElement = useRef<HTMLElement>(null);

  const activeIndex = useMotionValue(0);
  const isSnapping = useMotionValue<0 | 1>(0);

  const registerSection = useCallback(
    (el: HTMLElement | null, options?: { offset?: number }) => {
      if (!el) return;

      const offset = options?.offset ?? 0;

      const exists = sectionsRef.current.some((s) => s.el === el);

      if (!exists) {
        sectionsRef.current.push({ el, offset });
      }
    },
    []
  );

  const lockSnap = useCallback(() => {
    programmaticScrollRef.current = true;
  }, []);

  const unlockSnap = useCallback(() => {
    programmaticScrollRef.current = false;
  }, []);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = ({ scroll }: { scroll: number }) => {
      if (snappingRef.current) return;
      if (programmaticScrollRef.current) return;

      const scrollingDown = scroll > lastScrollRef.current;
      lastScrollRef.current = scroll;

      if (!scrollingDown && !snapTopBottom) return;

      for (let i = 0; i < sectionsRef.current.length; i++) {
        const { el, offset } = sectionsRef.current[i];
        const rect = el.getBoundingClientRect();

        /**
         * We snap only when the section's top
         * is entering the threshold zone
         */
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

          setTimeout(() => {
            snappingRef.current = false;
            isSnapping.set(0);
          }, duration * 1000 + 80);

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
