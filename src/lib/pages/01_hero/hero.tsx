import { AnimatePresence, motion, useInView } from "motion/react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import ScrollVelocity from "../../components/scroll-velocity";
import { TextEffect } from "../../components/text-effect";
import { cn } from "../../utils";
import HeroCTA from "./hero-cta";
import HeroSkillsList from "./hero-skills-list";
import HeroTagLine from "./hero-tag-line";

const FloatingBalloon = lazy(
  () => import("../../components/balloon/floating-balloon"),
);

const ELEMENTS_INITIAL_DELAY = 1500;

export default function Hero({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementsVisible, setElementsVisible] = useState<boolean>(false);
  const isInView = useInView(containerRef, { margin: "-50% 0% -50% 0%" });

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
      ref={containerRef}
      data-bg-theme="light"
      id="top"
      className={cn(
        "h-[calc(100vh-var(--header-height))] w-full relative grid grid-cols-[8rem_1fr_1fr_1fr_1fr_8rem] grid-rows-[8rem_1fr_1fr_1fr_8rem] select-none",
        "bg-linear-to-b from-light-1 via-light-2 to-light-1",
        className,
      )}
    >
      {/* Balloon Canvas */}
      {elementsVisible && (
        <AnimatePresence mode="popLayout">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative row-span-full col-span-full z-2 pointer-events-none mask-b-from-95%"
          >
            <Suspense fallback={null}>
              <FloatingBalloon eventSource={containerRef} paused={!isInView} />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Borders */}
      <div className="row-span-full col-span-full grid grid-cols-subgrid grid-rows-subgrid opacity-75 mask-t-from-95% mask-b-from-95% mask-l-from-95% mask-r-from-95% pointer-events-none">
        <div className="row-[1/2] col-[1/2] border-r border-b border-light-2" />
        <div className="row-[1/2] col-[-1/-2] border-l border-b border-light-2" />
        <div className="row-[-1/-2] col-[1/2] border-r border-t border-light-2" />
        <div className="row-[-1/-2] col-[-1/-2] border-l border-t border-light-2" />
      </div>

      {/* Content */}
      <div className="relative col-span-full row-span-full grid grid-cols-subgrid grid-rows-subgrid">
        <TextEffect
          per="char"
          as="h2"
          delay={0.25}
          className="overflow-hidden row-[1/2] col-[1/2] text-2xl font-thin text-dark-1 tracking-wide place-self-end uppercase px-6 py-2 trim-text-caps"
        >
          Hi!
        </TextEffect>
        <TextEffect
          per="char"
          as="h2"
          delay={0.25}
          className="overflow-hidden row-[1/2] col-[2/3] text-2xl font-thin text-dark-1 tracking-wide self-end uppercase px-6 py-2 trim-text-caps"
        >
          I'm Aniket Das.
        </TextEffect>

        <TextEffect
          per="char"
          as="h2"
          delay={0.25}
          className="overflow-hidden row-[1/2] col-[-2/-3] text-sm font-thin text-dark-1 text-end tracking-wide self-end uppercase px-6 py-2 trim-text-caps"
        >
          Kolkata
        </TextEffect>

        <TextEffect
          per="char"
          as="h2"
          delay={0.25}
          className="overflow-hidden row-[1/2] col-[-1/-2] text-sm font-thin text-dark-1 tracking-wide self-end uppercase px-6 py-2 trim-text-caps"
        >
          India
        </TextEffect>

        <motion.div className="row-[2/-2] col-[2/-2] bg-light-1 grid grid-rows-subgrid grid-cols-subgrid shadow-xl">
          <HeroTagLine className="row-[1/-2] col-[1/-2] size-min whitespace-nowrap" />
          <motion.div
            initial={{ y: 24, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ delay: 1, ease: "easeInOut" }}
            className="row-[1/-2] col-[-1/-2] size-min self-end space-y-2"
          >
            <HeroSkillsList className="place-items-end" />
            <HeroCTA className="w-min" />
          </motion.div>
        </motion.div>

        {/* Scrolling Marquee */}
        {elementsVisible && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ y: 32, clipPath: "inset(0% 0% 100% 0%)" }}
              animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="col-span-full row-[-1/-3] flex items-end overflow-x-clip overflow-y-visible py-2 z-3"
            >
              <ScrollVelocity
                texts={[
                  <p className="trim-text-caps font-medium">
                    CREATIVE&nbsp;
                    <span className="italic font-black">DEV</span>
                    ELOPER&nbsp;
                  </p>,
                ]}
                numCopies={2}
                velocity={-40}
                className="text-[max(14vw,9rem)] tracking-tighter text-dark-1 flex items-end"
                parallaxClassName="overflow-visible"
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
