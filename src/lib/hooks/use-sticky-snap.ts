import { useLenis } from "lenis/react";
import { easeOut, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";

interface StickySnapOptions {
  headerRef: React.RefObject<HTMLElement | null>;
  snapOffset?: number;
  duration?: number;
  snapTopBottom?: boolean;
}

export function useStickySnap({
  headerRef,
  snapOffset = 100,
  duration = 0.8,
  snapTopBottom = true,
}: StickySnapOptions) {
  const lenis = useLenis();

  const sectionsRef = useRef<HTMLElement[]>([]);
  const snappingRef = useRef(false);
  const lastScrollRef = useRef(0);

  const activeIndex = useMotionValue(0);
  const isSnapping = useMotionValue(0); // 0 or 1

  const registerSection = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    if (!lenis || !headerRef.current) return;

    const headerHeight = headerRef.current.offsetHeight;

    const onScroll = ({ scroll }: { scroll: number }) => {
      if (snappingRef.current) return;

      const scrollingDown = scroll > lastScrollRef.current;
      lastScrollRef.current = scroll;

      if (!scrollingDown && !snapTopBottom) return;

      for (let i = 0; i < sectionsRef.current.length; i++) {
        const section = sectionsRef.current[i];
        const rect = section.getBoundingClientRect();
        const targetY = scroll + rect.top - headerHeight;
        const distance = Math.abs(scroll - targetY);

        if (distance < snapOffset) {
          snappingRef.current = true;

          // sync Motion
          activeIndex.set(i);
          isSnapping.set(1);

          lenis.scrollTo(targetY, { duration, easing: easeOut });

          // unlock after animation
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
  }, [
    lenis,
    headerRef,
    snapOffset,
    duration,
    activeIndex,
    isSnapping,
    snapTopBottom,
  ]);

  return {
    registerSection,
    activeIndex, // MotionValue<number>
    isSnapping, // MotionValue<0 | 1>
  };
}
