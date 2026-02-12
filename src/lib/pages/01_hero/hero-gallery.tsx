import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { AnimatePresence, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../utils";

const IMAGES = [
  {
    name: "Hello!",
    src: "/assets/portrait/Portrait-HRES.png",
  },
  {
    name: "Antigravity",
    src: "/assets/works/blender/antigravity.png",
  },
  {
    name: "Bio-Pod",
    src: "/assets/works/blender/aquarium_of_life.png",
  },
  {
    name: "Subject A",
    src: "/assets/works/blender/bathroom_woman.png",
  },
  {
    name: "Cyberpunk",
    src: "/assets/works/blender/cyberpunk_01.png",
  },
  {
    name: "Cyberpunk",
    src: "/assets/works/blender/cyberpunk_02.png",
  },
  {
    name: "Detained",
    src: "/assets/works/blender/detained.png",
  },
  {
    name: "For you",
    src: "/assets/works/blender/hand_and_rose_cmp.png",
  },
  {
    name: "Life Support",
    src: "/assets/works/blender/life_support.png",
  },
  {
    name: "Lost",
    src: "/assets/works/blender/lost_01.png",
  },
  {
    name: "Lost",
    src: "/assets/works/blender/lost_02.png",
  },
  {
    name: "Lost",
    src: "/assets/works/blender/lost_03.png",
  },
  {
    name: "OMW",
    src: "/assets/works/blender/omw.png",
  },
  {
    name: "Ruins",
    src: "/assets/works/blender/piano_ruins.png",
  },
  {
    name: "Sunken",
    src: "/assets/works/blender/sunken.png",
  },
  {
    name: "Door",
    src: "/assets/works/blender/the_door.png",
  },
];

const IMAGE_TRANSITION_TIMER = 5000;
const INITIAL_TRANSITION_START_DELAY = 1000;

export default function HeroGallery({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const [index, setIndex] = useState<number>(0);
  const [hoverIntent, setHoverIntent] = useState<boolean>(true);

  useEffect(() => {
    if (!hoverIntent) {
      const interval = setInterval(() => {
        setIndex((current) => (current + 1) % IMAGES.length);
      }, IMAGE_TRANSITION_TIMER);

      return () => clearInterval(interval);
    }
  }, [hoverIntent]);

  useEffect(() => {
    const t = setTimeout(
      () => setHoverIntent(false),
      INITIAL_TRANSITION_START_DELAY,
    );
    return () => clearTimeout(t);
  }, []);

  const previousIndex = useCallback(() => {
    let _index = index - 1;
    if (_index < 0) _index = IMAGES.length - 1;
    setIndex(_index);
  }, [index]);

  const nextIndex = useCallback(() => {
    let _index = index + 1;
    if (_index >= IMAGES.length) _index = 0;
    setIndex(_index);
  }, [index]);

  return (
    <m.div
      ref={containerRef}
      className={cn(
        "relative size-full flex items-center justify-center origin-bottom p-4",
        className,
      )}
      initial={{ scale: 0.9, clipPath: "inset(0% 0% 100% 0%)", y: -32 }}
      animate={{ scale: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
      transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
    >
      <div className="relative h-full aspect-4/6 rounded-t-[24rem] rounded-b-xl overflow-hidden">
        <m.div style={{ y, scale }} className="relative size-full select-none">
          <AnimatePresence mode="popLayout">
            <m.div
              key={`${index}-left`}
              initial={{ clipPath: "inset(0% 100% 0% 0%)", scale: 1.25 }}
              animate={{ clipPath: "inset(0% 49% 0% 0%)", scale: 1 }}
              exit={{ clipPath: "inset(80% 0% 0% 0%)", scale: 1.25 }}
              transition={{ duration: 1, ease: "circInOut" }}
              className="absolute size-full"
            >
              <img
                src={IMAGES[index].src}
                alt={IMAGES[index].name}
                className="size-full object-cover scale-105"
                draggable={false}
              />
            </m.div>
            <m.div
              key={`${index}-right`}
              initial={{ clipPath: "inset(0% 0% 0% 100%)", scale: 1.25 }}
              animate={{ clipPath: "inset(0% 0% 0% 49%)", scale: 1 }}
              exit={{ clipPath: "inset(80% 0% 0% 0%)", scale: 1.25 }}
              transition={{ duration: 1, ease: "circInOut" }}
              className="absolute size-full"
            >
              <img
                src={IMAGES[index].src}
                alt={IMAGES[index].name}
                className="size-full object-cover scale-105"
                draggable={false}
              />
            </m.div>
          </AnimatePresence>
        </m.div>
        <div className="absolute right-0 bottom-16 left-1/3 h-10">
          <div
            onMouseEnter={() => setHoverIntent(true)}
            onMouseLeave={() => setHoverIntent(false)}
            className="relative pr-2 size-full bg-light-1 rounded-l-[6px] grid grid-cols-[3rem_1fr_3rem] gap-3 items-center justify-center overflow-hidden"
          >
            <button
              onClick={previousIndex}
              className="row-[1/2] col-[1/2] size-full rounded-[6px] hover:bg-light-2/25 transition-colors place-items-center place-content-center cursor-pointer"
            >
              <IconChevronLeft className="size-4 stroke-dark-2" />
            </button>
            <AnimatePresence mode="wait">
              <m.p
                key={IMAGES[index].name}
                initial={{ y: "-100%", opacity: 0, scaleX: 0.8 }}
                animate={{ y: "0%", opacity: 1, scaleX: 1 }}
                exit={{ y: "100%", opacity: 0, scaleX: 0.8 }}
                className="row-[1/2] col-[2/3] place-self-center font-medium font-width-110 text-dark-1 pt-1"
              >
                {IMAGES[index].name}
              </m.p>
            </AnimatePresence>
            <button
              onClick={nextIndex}
              className="row-[1/2] col-[3/4] size-full rounded-[6px] hover:bg-light-2/25 transition-colors place-items-center place-content-center cursor-pointer"
            >
              <IconChevronRight className="size-4 stroke-dark-2" />
            </button>
          </div>
          <svg className="absolute size-full bottom-[calc(100%-1px)] -right-px">
            <defs>
              <mask id={`cover-mask-hero-gallery-top`}>
                <rect width="100%" height="100%" fill="white" />
                <rect width="100%" height="100%" fill="black" rx="12" ry="12" />
                <rect width="100%" height="50%" fill="black" y="0%" />
                <rect width="50%" height="100%" fill="black" x="0%" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              mask={`url(#cover-mask-hero-gallery-top)`}
              className="fill-light-1"
            />
          </svg>
          <svg className="absolute size-full top-[calc(100%-1px)] -right-px">
            <defs>
              <mask id={`cover-mask-hero-gallery-bottom`}>
                <rect width="100%" height="100%" fill="white" />
                <rect width="100%" height="100%" fill="black" rx="8" ry="8" />
                <rect width="100%" height="50%" fill="black" y="50%" />
                <rect width="50%" height="100%" fill="black" x="0%" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              mask={`url(#cover-mask-hero-gallery-bottom)`}
              className="fill-light-1"
            />
          </svg>
        </div>
      </div>
    </m.div>
  );
}
