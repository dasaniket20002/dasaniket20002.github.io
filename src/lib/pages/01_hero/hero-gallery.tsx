import { AnimatePresence, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils";

const IMAGES = [
  "/assets/portrait/Portrait-HRES.png",
  "/assets/works/blender/antigravity.png",
  "/assets/works/blender/aquarium_of_life.png",
  "/assets/works/blender/bathroom_woman.png",
  "/assets/works/blender/cyberpunk_01.png",
  "/assets/works/blender/cyberpunk_02.png",
  "/assets/works/blender/detained.png",
  "/assets/works/blender/hand_and_rose_cmp.png",
  "/assets/works/blender/life_support.png",
  "/assets/works/blender/lost_01.png",
  "/assets/works/blender/lost_02.png",
  "/assets/works/blender/lost_03.png",
  "/assets/works/blender/omw.png",
  "/assets/works/blender/piano_ruins.png",
  "/assets/works/blender/sunken.png",
  "/assets/works/blender/the_door.png",
];
const IMAGE_TRANSITION_TIMER = 2500;

export default function HeroGallery({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [32, -64]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.3]);

  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    let t: number;

    const changeindex = () => {
      t = setTimeout(() => {
        setIndex((p) => (p + 1) % IMAGES.length);
        changeindex();
      }, IMAGE_TRANSITION_TIMER);
    };

    t = setTimeout(() => changeindex(), 1500);

    return () => {
      if (t) clearTimeout(t);
    };
  }, []);
  return (
    <m.div
      ref={containerRef}
      className={cn(
        "relative size-full flex items-center justify-center @container-[size] origin-bottom",
        className,
      )}
      initial={{ scale: 0.85, clipPath: "inset(100% 100% 0% 0%)", y: 24 }}
      animate={{ scale: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
      transition={{ duration: 0.75, delay: 1, ease: "easeInOut" }}
    >
      <div className="relative h-9/10 aspect-4/6 rounded-t-[24rem] rounded-b-2xl overflow-hidden shadow-xl inset-shadow-sm inset-shadow-dark-2/25">
        <AnimatePresence mode="popLayout">
          <m.div
            key={`${index}-left`}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ x: "-100%" }}
            style={{
              y,
              scale,
              backgroundImage: IMAGES[index],
            }}
            className="absolute size-full bg-no-repeat bg-cover bg-center mask-[linear-gradient(to_left,transparent_50%,black_50%)]"
          />
          {/* <m.div
            key={`${index}-right`}
            style={{
              y,
              scale,
              backgroundImage: "url(/assets/portrait/Portrait-HRES.png)",
            }}
            className="absolute size-full bg-no-repeat bg-cover bg-center mask-[linear-gradient(to_right,transparent_50%,black_50%)]"
          /> */}
        </AnimatePresence>
      </div>
    </m.div>
  );
}
