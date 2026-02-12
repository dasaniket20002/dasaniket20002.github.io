import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Link from "../../components/link";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "../../components/scroll-velocity";
import { TextEffect } from "../../components/text-effect";
import { cn } from "../../utils";
import HeroCTA from "./hero-cta";
import HeroSkillsList from "./hero-skills-list";
import HeroTagLine from "./hero-tag-line";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import { useWindowSize } from "../../hooks/use-window-size";
import HeroGallery from "./hero-gallery";

const FloatingBalloon = lazy(
  () => import("../../components/balloon/floating-balloon"),
);

const ELEMENTS_INITIAL_DELAY = 1500;

export default function Hero({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementsVisible, setElementsVisible] = useState<boolean>(false);
  const isInView = useInView(containerRef, { margin: "-50% 0% -50% 0%" });
  const { width: windowWidth } = useWindowSize();

  const { registerSection } = useStickySnap();

  useEffect(() => {
    const t = setTimeout(
      () => setElementsVisible(true),
      ELEMENTS_INITIAL_DELAY,
    );
    return () => {
      if (t) clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={(r) => {
        containerRef.current = r;
        registerSection(r, { useDefaultHeaderHeight: false });
      }}
      data-bg-theme="light"
      id="hero"
      className={cn(
        "h-[calc(100dvh-var(--header-height))] w-full relative",
        "grid",
        "grid-cols-[4rem_1fr_1fr_1fr_1fr_4rem] grid-rows-[8rem_1fr_1fr_1fr_8rem]",
        "md:grid-cols-[8rem_1fr_1fr_1fr_1fr_8rem] md:grid-rows-[8rem_1fr_1fr_1fr_8rem]",
        "bg-linear-to-b from-light-1 via-light-2 to-light-1",
        className,
      )}
    >
      {/* Balloon Canvas */}
      {/* {elementsVisible && windowWidth > 768 && (
        <div className="relative row-span-full col-span-full z-2 pointer-events-none mask-b-from-95%">
          <Suspense fallback={null}>
            <FloatingBalloon eventSource={containerRef} inView={isInView} />
          </Suspense>
        </div>
      )} */}

      {/* Borders */}
      <div className="row-span-full col-span-full grid grid-cols-subgrid grid-rows-subgrid opacity-75 mask-t-from-95% mask-b-from-95% mask-l-from-95% mask-r-from-95% pointer-events-none">
        <div className="row-[1/2] col-[1/2] border-r border-b border-light-2" />
        <div className="row-[1/2] col-[-1/-2] border-l border-b border-light-2" />
        <div className="row-[-1/-2] col-[1/2] border-r border-t border-light-2" />
        <div className="row-[-1/-2] col-[-1/-2] border-l border-t border-light-2" />
      </div>

      {/* Content */}
      <div className="relative col-span-full row-span-full grid grid-cols-subgrid grid-rows-subgrid">
        {windowWidth > 768 && (
          <TextEffect
            per="word"
            as="h2"
            delay={0.25}
            speedSegment={0.75}
            className="overflow-hidden row-[1/2] col-[1/2] text-3xl font-light text-dark-1 tracking-wide place-self-end uppercase p-2 trim-text-caps"
          >
            Hi!
          </TextEffect>
        )}
        <TextEffect
          per="word"
          as="h2"
          delay={0.25}
          speedSegment={0.75}
          className="overflow-hidden row-[1/2] col-[2/5] text-3xl font-light text-dark-1 tracking-wide self-end uppercase px-6 py-2 trim-text-caps"
        >
          {`${windowWidth <= 768 ? "Hi!" : ""} I'm Aniket Das.`}
        </TextEffect>

        <Link
          href={"https://earth.google.com/web/search/Kolkata,+West+Bengal"}
          showBG={false}
          className="overflow-hidden row-[1/2] col-[5/6] text-base font-light text-dark-1 tracking-wide place-self-end uppercase mx-6 trim-text-caps w-min"
          initial={{ y: 24, clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ delay: 0.6, ease: "easeInOut" }}
        >
          {`KOLKATA${windowWidth < 768 ? ", INDIA" : ""}`}
        </Link>

        {windowWidth >= 768 && (
          <Link
            href={"https://earth.google.com/web/search/Kolkata,+West+Bengal"}
            showBG={false}
            className="overflow-hidden row-[1/2] col-[6/7] text-base font-light text-dark-1 tracking-wide self-end uppercase mx-2 trim-text-caps w-min"
            initial={{ y: 24, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ delay: 0.5, ease: "easeInOut" }}
          >
            India
          </Link>
        )}

        <m.div className="row-[2/-2] col-[2/-2] bg-light-1 grid grid-rows-4 grid-cols-5 shadow-xl">
          <HeroGallery className="row-[3/5] col-[1/-2] md:row-span-full md:col-[3/5]" />
          <HeroTagLine className="row-[1/3] col-span-full" />
          <m.div
            initial={{ y: 24, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ delay: 1.15, duration: 0.5, ease: "easeInOut" }}
            className="row-[2/4] col-span-full size-full space-y-2 md:place-content-end"
          >
            <HeroSkillsList className="place-items-end" />
            <HeroCTA />
          </m.div>
        </m.div>

        {/* Scrolling Marquee */}
        <ScrollVelocityContainer
          className="col-span-full row-[-1/-3] py-2 z-3 text-dark-1 space-y-3 self-end overflow-x-clip overflow-y-visible"
          initial={{ y: 24, clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ delay: 1.25, duration: 0.75, ease: "easeIn" }}
        >
          <ScrollVelocityRow
            baseVelocity={5}
            direction={1}
            className="flex items-end overflow-visible text-[18rem] md:text-[14rem]"
          >
            <p className="sr-only">CREATIVE DEVELOPER</p>
            <div className="trim-text-caps font-medium tracking-[-0.11em] leading-none font-width-110">
              <span className="italic trim-text-caps font-light">C</span>
              RE
              <span className="font-black mr-[-0.12em] trim-text-caps">A</span>
              TIVE&nbsp;
              <span className="italic font-black trim-text-caps">DEV</span>
              EL
              <span className="italic trim-text-caps">0</span>
              PER&nbsp;
            </div>
          </ScrollVelocityRow>
          <ScrollVelocityRow
            baseVelocity={60}
            direction={-1}
            className="text-base md:text-xs font-thin"
          >
            <p className="mx-8">Scroll Down</p>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>
    </div>
  );
}
