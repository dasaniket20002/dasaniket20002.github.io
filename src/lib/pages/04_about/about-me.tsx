import { useMotionTemplate, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef } from "react";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { useElementSize } from "../../hooks/use-element-size";
import { useWindowSize } from "../../hooks/use-window-size";
import { cn } from "../../utils";
import AboutMeContent from "./about-me-content";

export default function AboutMe({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealHeaderRef = useRef<HTMLDivElement>(null);
  const aboutContainerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();
  const { width: windowWidth } = useWindowSize();
  const { height: aboutContainerHeight } = useElementSize(aboutContainerRef);

  const { scrollYProgress: revealProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 0.75"],
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["-0.25 end", "end start"],
  });

  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"],
  });

  const titleRevealY = useTransform(revealProgress, [0, 1], ["100%", "0%"]);

  const _revealBlur = useTransform(revealProgress, [0, 1], [3, 0]);
  const _exitBlur = useTransform(exitProgress, [0.8, 1], [0, 3]);
  const _titleBlur = useTransform([_revealBlur, _exitBlur], ([reveal, exit]) =>
    Math.max(reveal as number, exit as number),
  );
  const titleRevealBlur = useMotionTemplate`blur(${_titleBlur}px)`;

  const titleParallaxTop = useTransform(
    scrollYProgress,
    [0, 1],
    ["100%", "0%"],
  );

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  return (
    <div
      ref={containerRef}
      id="about"
      className={cn(
        "relative grid gap-y-12 md:gap-y-0 py-16 h-dvh",
        "grid-cols-[4rem_1fr_4rem] grid-rows-[auto_1fr]",
        "md:grid-cols-[8rem_1fr_1fr_1fr_8rem]",
        className,
      )}
    >
      <div
        ref={revealHeaderRef}
        className="sticky top-16 md:relative md:top-0 row-[1/2] md:row-[1/3] col-[2/-2] md:col-[2/3] w-full z-1"
        style={{
          height: windowWidth >= 768 ? aboutContainerHeight : "auto",
        }}
      >
        <m.div
          style={{ top: windowWidth >= 768 ? titleParallaxTop : 0 }}
          className="sticky flex flex-col"
        >
          <div className="mask-b-from-80%">
            <m.h3
              style={{ y: titleRevealY, filter: titleRevealBlur }}
              className="text-4xl font-width-125 font-light tracking-wide uppercase"
            >
              beyond the portfolio
            </m.h3>
          </div>
          <div className="mask-b-from-80%">
            <m.p
              style={{ y: titleRevealY, filter: titleRevealBlur }}
              className="text-xl font-width-120 font-extralight tracking-wide uppercase"
            >
              who am i?
            </m.p>
          </div>
        </m.div>
      </div>
      <AboutMeContent
        ref={aboutContainerRef}
        className="row-[2/3] md:row-[1/3] col-[2/-2] md:col-[3/5] h-full"
      />
    </div>
  );
}
