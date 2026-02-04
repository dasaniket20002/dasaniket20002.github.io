import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useScreenShake } from "../../hooks/use-screen-shake";
import { cn } from "../../utils";
import HeroCTA from "./hero-cta";
import HeroGallery from "./hero-gallery";
import HeroImage from "./hero-image";
import HeroSkillList from "./hero-skills-list";
import HeroSubtitle from "./hero-subtitle";
import HeroTagLine from "./hero-tag-line";
import HeroTitle from "./hero-title";
import { GameOfLife } from "../../components/game-of-life/game-of-life";

const SKETCH_HIDDEN_INITIAL_DELAY = 2000;

export default function Hero({ className }: { className?: string }) {
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const [sketchHidden, setSketchHidden] = useState(true);

  const { controls: screenShakeControls, shake } =
    useScreenShake(dragContainerRef);

  useEffect(() => {
    const t = setTimeout(
      () => setSketchHidden(false),
      SKETCH_HIDDEN_INITIAL_DELAY,
    );

    return () => {
      if (t) clearTimeout(t);
    };
  }, []);

  return (
    <div
      data-bg-theme="light"
      className={cn(
        "h-[calc(100vh-var(--header-height))] w-full @container-[size]",
        "bg-light-1 text-dark-1",
        className,
      )}
      id="top"
    >
      <motion.div
        ref={dragContainerRef}
        className="relative grid grid-cols-8 grid-rows-6 p-2 size-full"
        animate={screenShakeControls}
      >
        <div className="row-span-full col-span-full size-full grid grid-cols-subgrid grid-rows-subgrid opacity-75 mask-radial-at-center mask-radial-closest-corner mask-radial-from-0% pointer-events-none">
          <div className="row-[1/3] col-[1/6] border-light-2 border-r" />
          <div className="row-[2/3] col-[6/7] border-light-2 border-t" />
          <div className="row-[1/3] col-[7/9] border-light-2 border-l" />
          <div className="row-[3/7] col-[1/9] border-light-2 border-t" />
          <div className="row-[3/7] col-[3/7] border-light-2 border-l" />
          <div className="row-[3/4] col-[7/9] border-light-2 border-l" />
          <div className="row-[4/7] col-[7/9] border-light-2 border-l border-t" />
          <div className="row-[5/7] col-[1/3] border-light-2 border-t" />
        </div>

        {!sketchHidden && (
          <GameOfLife
            className="row-span-full col-span-full size-full mask-radial-at-center mask-radial-farthest-corner mask-radial-from-0%"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, ease: "easeIn" }}
          />
        )}

        <HeroTagLine className="place-self-center row-[1/3] col-[1/6] z-1" />
        <HeroSkillList className="place-self-end row-[1/3] col-[6/9] z-1" />
        <HeroImage className="place-self-center row-[3/5] col-[5/6] z-1" />
        <HeroSubtitle className="row-[3/5] col-[2/7] z-1" />
        <HeroTitle
          containerRef={dragContainerRef}
          className="row-[5/7] col-[2/7] z-1"
        />
        <HeroCTA className="row-[4/7] col-[7/9] z-1" />
        <HeroGallery
          className="row-[3/5] col-[1/3] z-101"
          shake={shake}
          containerRef={dragContainerRef}
        />
      </motion.div>
    </div>
  );
}
