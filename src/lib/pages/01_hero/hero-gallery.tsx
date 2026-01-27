import { AnimatePresence, motion, useDragControls } from "motion/react";
import { cn } from "../../utils";
import {
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
} from "@tabler/icons-react";
import useLongPress, { type MaybeEvent } from "../../hooks/use-long-press";
import { useEffect, useState } from "react";
import type { ShakeOptions } from "../../hooks/use-screen-shake";

const carouselImages: {
  imgSrc: string;
  name: string;
}[] = [
  {
    imgSrc: "/assets/works/blender/antigravity.png",
    name: "Antigravity",
  },
  {
    imgSrc: "/assets/works/blender/aquarium_of_life.png",
    name: "Bio-Pod",
  },
  {
    imgSrc: "/assets/works/blender/bathroom_unclean.png",
    name: "Washroom",
  },
  {
    imgSrc: "/assets/works/blender/bathroom_woman.png",
    name: "Woman",
  },
  {
    imgSrc: "/assets/works/blender/beach_bottle.png",
    name: "Bottle",
  },
  {
    imgSrc: "/assets/works/blender/black_hole.png",
    name: "Black Hole",
  },
  {
    imgSrc: "/assets/works/blender/burning_butterfly.png",
    name: "Burning Butterfly",
  },
  {
    imgSrc: "/assets/works/blender/candy.png",
    name: "Candy",
  },
  {
    imgSrc: "/assets/works/blender/car_ruins.png",
    name: "Ruins",
  },
  {
    imgSrc: "/assets/works/blender/cyberpunk_01.png",
    name: "Cyberpunk",
  },
  {
    imgSrc: "/assets/works/blender/cyberpunk_02.png",
    name: "Cyberpunk",
  },
  {
    imgSrc: "/assets/works/blender/data_cube.png",
    name: "Data Cube",
  },
  {
    imgSrc: "/assets/works/blender/detained.png",
    name: "Detained",
  },
  {
    imgSrc: "/assets/works/blender/distort.png",
    name: "Distort",
  },
  {
    imgSrc: "/assets/works/blender/hallows.png",
    name: "Hallows",
  },
  {
    imgSrc: "/assets/works/blender/hand_and_rose.png",
    name: "For U",
  },
  {
    imgSrc: "/assets/works/blender/life_support.png",
    name: "Life Support",
  },
  {
    imgSrc: "/assets/works/blender/lost_01.png",
    name: "Lost",
  },
  {
    imgSrc: "/assets/works/blender/lost_02.png",
    name: "Lost",
  },
  {
    imgSrc: "/assets/works/blender/lost_03.png",
    name: "Lost",
  },
  {
    imgSrc: "/assets/works/blender/omw.png",
    name: "OMW",
  },
  {
    imgSrc: "/assets/works/blender/piano_ruins.png",
    name: "Ruins",
  },
  {
    imgSrc: "/assets/works/blender/sunken.png",
    name: "Sunken",
  },
  {
    imgSrc: "/assets/works/blender/the_door.png",
    name: "The Door",
  },
];

const IMAGE_SWAP_DURATION = 6000;

export default function HeroGallery({
  className,
  shake,
  containerRef,
}: {
  className?: string;
  shake: (options?: ShakeOptions) => void;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragged, setDragged] = useState(false);

  const dragControls = useDragControls();

  const onLongPress = () => shake();
  const onLongPressStart = (e: MaybeEvent) => {
    setDragged(true);
    dragControls.start(e as React.PointerEvent, { distanceThreshold: 0.1 });
  };
  const onLongPressEnd = () => dragControls.stop();

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setIndex((current) => (current + 1) % carouselImages.length);
      }, IMAGE_SWAP_DURATION);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <motion.div
      initial={{ scale: 1.15, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1, ease: "anticipate" }}
      className={cn("size-full relative", className)}
    >
      <motion.div
        {...useLongPress({
          onLongPress,
          onLongPressStart,
          onLongPressEnd,
          repeatInterval: 2000,
        })}
        drag
        dragConstraints={containerRef}
        dragControls={dragControls}
        dragListener={false}
        className="relative size-full overflow-hidden rounded cursor-grab active:cursor-grabbing"
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: isHovered && isDragged ? 1.5 : 1, opacity: 1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="size-full"
            initial={{ clipPath: "inset(0 100% 0 0%)", opacity: 0.1 }}
            animate={{ clipPath: "inset(0 0% 0 0%)", opacity: 1 }}
            exit={{ clipPath: "inset(0 0% 0 100%)", opacity: 0.1 }}
            transition={{ ease: "anticipate" }}
          >
            <img
              src={carouselImages[index].imgSrc}
              alt={carouselImages[index].name}
              className="select-none pointer-events-none size-full object-cover z-101"
              draggable={false}
            />
            <AnimatePresence mode="popLayout">
              {isHovered && (
                <motion.div
                  className="w-full h-[calc(100%+2rem)] absolute inset-0 flex flex-col gap-2 items-center justify-center select-none z-98"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "100%" }}
                  transition={{ ease: "anticipate" }}
                >
                  <div className="absolute inset-0 bg-size-[4px_4px] backdrop-blur-xs mask-t-from-0 bg-[radial-gradient(var(--color-dark-1)_1px,var(--color-dark-2)_1px)] z-97" />
                  <p className="font-bold italic text-2xl text-light-2 z-98 text-shadow-lg">
                    {carouselImages[index].name}
                  </p>
                  <a
                    href="#"
                    className="text-xs flex items-center gap-1 text-light-1 tracking-widest font-thin z-98 text-shadow-lg"
                  >
                    Visit
                    <IconExternalLink className="size-3 stroke-1" />
                  </a>
                  {!isDragged && (
                    <p className="text-[10px] text-light-2/75 z-98 tracking-widest font-extralight text-shadow-lg absolute top-1 right-1">
                      Long press to move
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.button
          onClick={() =>
            setIndex(
              (i) => (i - 1 + carouselImages.length) % carouselImages.length,
            )
          }
          className="absolute left-2 top-1/2 -translate-y-1/2 size-6 p-1 rounded-full flex items-center justify-center z-98 cursor-pointer bg-light-1 [&>svg]:stroke-transparent hover:[&>svg]:stroke-dark-1"
          initial={{ scale: 0.5, opacity: 0.25 }}
          animate={{ scale: 0.5, opacity: isHovered ? 0.75 : 0.25 }}
          whileHover={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.5 }}
        >
          <IconChevronLeft />
        </motion.button>

        <motion.button
          onClick={() => setIndex((i) => (i + 1) % carouselImages.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 size-6 p-1 rounded-full flex items-center justify-center z-98 cursor-pointer bg-light-1 [&>svg]:stroke-transparent hover:[&>svg]:stroke-dark-1"
          initial={{ scale: 0.5, opacity: 0.25 }}
          animate={{ scale: 0.5, opacity: isHovered ? 0.75 : 0.25 }}
          whileHover={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.5 }}
        >
          <IconChevronRight />
        </motion.button>

        {/* Progress Indicator */}
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 h-2 z-98"
          initial={{ scale: 0.5, opacity: 0.25 }}
          animate={{ scale: 0.5, opacity: isHovered ? 0.75 : 0.25 }}
          whileHover={{ scale: 1, opacity: 1 }}
        >
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1 rounded-full transition-all cursor-pointer",
                i === index ? "w-4 bg-light-2" : "w-1 bg-light-2/50",
              )}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
