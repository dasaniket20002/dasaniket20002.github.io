import { type RefObject, useEffect, useRef } from "react";
import {
  animate,
  useMotionValueEvent,
  useScroll,
  type AnimationPlaybackControlsWithThen,
} from "motion/react";

type SnapOptions = {
  offset?: number; // fixed header height
  proximity?: number; // px from top to snap
  minVelocity?: number; // px/ms
  snapDuration?: number; // ms
};

export function useScrollSnapSections(
  refs: RefObject<HTMLElement>[],
  {
    offset = 0,
    proximity = 120,
    minVelocity = 0.25,
    snapDuration = 500,
  }: SnapOptions = {}
) {
  const { scrollY } = useScroll(); // ✅ shared RAF scroll source

  const isSnapping = useRef(false);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const direction = useRef<"up" | "down">("down");
  const animationRef = useRef<AnimationPlaybackControlsWithThen>(null);

  useEffect(() => {
    lastTime.current = performance.now();
    lastY.current = scrollY.get();
  }, [scrollY]);

  // Track direction + user intent
  useMotionValueEvent(scrollY, "change", (latest) => {
    const now = performance.now();
    const deltaY = latest - lastY.current;

    direction.current = deltaY > 0 ? "down" : "up";

    // User intent override
    if (isSnapping.current && Math.abs(deltaY) > 2) {
      animationRef.current?.stop();
      isSnapping.current = false;
    }

    lastY.current = latest;
    lastTime.current = now;
  });

  useEffect(() => {
    const elements = refs
      .map((r) => r.current)
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isSnapping.current) return;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const rect = entry.target.getBoundingClientRect();
          const distanceFromTop = rect.top - offset;

          // Direction gating
          if (
            (direction.current === "down" && rect.top < offset) ||
            (direction.current === "up" && rect.top > offset)
          ) {
            return;
          }

          // Proximity gating
          if (Math.abs(distanceFromTop) > proximity) return;

          // Velocity gating
          const velocity =
            Math.abs(scrollY.get() - lastY.current) /
            Math.max(performance.now() - lastTime.current, 1);

          if (velocity > minVelocity) return;

          // SNAP
          isSnapping.current = true;

          animationRef.current = animate(
            scrollY.get(),
            scrollY.get() + distanceFromTop,
            {
              duration: snapDuration / 1000,
              ease: [0.22, 1, 0.36, 1],
              onUpdate: (v) => window.scrollTo(0, v),
              onComplete: () => {
                isSnapping.current = false;
              },
            }
          );
        });
      },
      {
        threshold: 0.6,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [refs, offset, proximity, minVelocity, snapDuration, scrollY]);
}
