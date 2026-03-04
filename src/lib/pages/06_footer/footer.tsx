import {
  useInView,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef } from "react";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import FooterContent from "./footer-content";
import FooterGraphic from "./footer-graphic";

export default function MaskSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  const inView = useInView(containerRef, { amount: "some", initial: false });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start -0.75"],
  });

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
      <m.div
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
        className="absolute inset-0 bg-dark-d pointer-events-none z-1"
      />

      <FooterGraphic inView={inView} className="h-1/2 w-full mask-b-from-90%" />
      <FooterContent className="h-1/2 w-full" />
    </div>
  );
}
