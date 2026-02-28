import {
  useInView,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { lazy, Suspense, useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { useStickySnap } from "../../contexts/use-sticky-snap";

const GlassScene = lazy(() => import("../../components/glass/glass-scene"));

export default function MaskSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  const inView = useInView(containerRef, { amount: "some", initial: false });

  // Track scroll relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start -0.75"],
  });

  // Animate ellipse size (in vh)
  const _maskSize = useTransform(
    scrollYProgress,
    [0, 1],
    ["0dvw 10dvh", "350dvw 100dvh"],
  );
  const maskImage = useMotionTemplate`radial-gradient(ellipse ${_maskSize} at center, transparent 100%, black 100%)`;

  return (
    <div
      id="footer"
      ref={containerRef}
      className="relative h-dvh w-full flex flex-col gap-8 bg-light-l overflow-hidden"
    >
      {/* Mask layer */}
      <m.div
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
        className="absolute inset-0 bg-dark-d pointer-events-none z-1"
      />

      {/* Content */}
      <div className="relative h-1/2 w-full mask-b-from-90%">
        <Suspense fallback={null}>
          <GlassScene inView={inView} />
        </Suspense>
      </div>
    </div>
  );
}
