import {
  IconArrowUpRight,
  IconPlayerTrackPrevFilled,
} from "@tabler/icons-react";
import { converter } from "culori";
import { useLenis } from "lenis/react";
import { useInView, useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { cn, getColorPropertyValue } from "../../utils";
import InfiniteGridMenu from "./infinite-menu-class";
import type { InfiniteMenuProps, MenuItem } from "./infinite-menu-types";
import { useWindowSize } from "../../hooks/use-window-size";
import { MIN_SECTION_HEADER_HEIGHT, SECTION_HEADER_HEIGHT } from "../../../App";

const defaultItems: MenuItem[] = [
  {
    image: `${window.location.origin}/assets/illustrations/undraw_under-construction_hdrn.png`,
    link: "https://google.com/", // TODO: Literally download my resume
    title: "WIP.",
    description: "Looking for meaningful opportunities 👀",
  },
];

const InfiniteMenu: FC<InfiniteMenuProps> = ({
  items = defaultItems,
  scale = 1.0,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sketchRef = useRef<InfiniteGridMenu | null>(null);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const isMoving = useMotionValue(0);
  const bgColor = useMemo(
    () => converter("rgb")(getColorPropertyValue("dark-2")),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    let sketch: InfiniteGridMenu | null = null;

    const handleActiveItem = (index: number) => {
      if (!items.length) return;
      const itemIndex = index % items.length;
      setActiveItem(items[itemIndex]);
    };

    if (canvas) {
      sketch = new InfiniteGridMenu(
        canvas,
        items,
        handleActiveItem,
        (b: boolean) => isMoving.set(b ? 1 : 0),
        (sk) => sk.run(),
        scale,
        bgColor,
      );
      sketchRef.current = sketch;
    }

    const handleResize = () => sketch?.resize();
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      sketch?.stop();
      sketchRef.current = null;
    };
  }, [bgColor, isMoving, items, scale]);

  const handleButtonClick = () => {
    if (!activeItem?.link) return;
    if (activeItem.link.startsWith("http")) {
      window.open(activeItem.link, "_blank");
    } else {
      console.log("Internal route:", activeItem.link);
      // TODO: Handle Internal routing
    }
  };

  const opacity = useTransform(isMoving, [0, 1], [1, 0]);
  const pointerEvents = useTransform(isMoving, [0, 1], ["auto", "none"]);
  const transitionDuration = useTransform(isMoving, [0, 1], ["500ms", "100ms"]);

  const descriptionX = useTransform(isMoving, [0, 1], ["0%", "-4rem"]);
  const navX = useTransform(isMoving, [0, 1], ["-4rem", "0rem"]);
  const buttonBottom = useTransform(isMoving, [0, 1], ["4rem", "-5rem"]);
  const buttonScale = useTransform(isMoving, [0, 1], [1, 0]);

  const lenis = useLenis();
  const { lockSnap, unlockSnap } = useStickySnap();

  const { width: windowWidth } = useWindowSize();
  const isInView = useInView(canvasRef, { margin: "-50% 0% -50% 0%" });

  useEffect(() => {
    const sketch = sketchRef.current;
    if (!sketch) return;
    if (isInView) {
      sketch.start();
    } else {
      sketch.stop();
    }
  }, [isInView]);

  return (
    <m.div
      animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
      transition={{ duration: 0.5, ease: "anticipate" }}
      className={cn("relative size-full", className)}
    >
      <canvas
        id="infinite-grid-menu-canvas"
        ref={canvasRef}
        className="cursor-grab w-full h-full overflow-hidden relative outline-none active:cursor-grabbing mask-t-from-80% mask-b-from-90% mask-l-from-95% mask-r-from-95%"
      />
      {activeItem && (
        <div className="absolute inset-0 pointer-events-none grid grid-cols-[4rem_1fr_1fr_4rem] grid-rows-[var(--min-section-header-height)_1fr] md:grid-rows-[var(--section-header-height)_1fr]">
          <m.div
            className="row-[2/3] md:row-[1/2] col-[2/4] md:col-[2/3] w-full h-min px-3 py-3 md:py-1 flex flex-col md:justify-end md:items-end gap-3"
            style={{
              opacity,
              pointerEvents,
              transitionDuration,
              x: descriptionX,
            }}
          >
            <h1
              className={cn(
                "font-black font-width-110 uppercase text-5xl fill-light-2 stroke-dark-2 stroke-8 trim-text-caps",
                "text-shadow-[0px_0px_4px_var(--tw-text-shadow-color),0px_0px_4px_var(--tw-text-shadow-color),0px_0px_16px_var(--tw-text-shadow-color)] text-shadow-dark-2",
              )}
            >
              {activeItem.title}
            </h1>
            <p
              className={cn(
                "text-xl text-light-2 trim-text-caps md:text-end",
                "text-shadow-[0px_0px_2px_var(--tw-text-shadow-color),0px_0px_2px_var(--tw-text-shadow-color),0px_0px_8px_var(--tw-text-shadow-color)] text-shadow-dark-2",
              )}
            >
              {activeItem.description}
            </p>
          </m.div>

          <m.span
            className="absolute top-1/2 -translate-y-1/2 right-16"
            style={{
              opacity,
              pointerEvents,
              x: navX,
              transitionDuration,
            }}
          >
            <m.button
              initial={{ rotate: "0deg", scale: 1 }}
              whileHover={{ rotate: "-90deg", scale: 1.1 }}
              transition={{
                rotate: {
                  ease: "anticipate",
                  duration: 0.25,
                  type: "spring",
                  bounce: 0.5,
                },
                scale: { duration: 0.1 },
              }}
              onClick={(e) => {
                e.preventDefault();
                lockSnap();
                lenis?.scrollTo("#services", {
                  onComplete: unlockSnap,
                  lock: true,
                  offset:
                    windowWidth >= 768
                      ? SECTION_HEADER_HEIGHT
                      : MIN_SECTION_HEADER_HEIGHT,
                });
              }}
              className="group size-24 place-items-center cursor-pointer"
            >
              <IconPlayerTrackPrevFilled className="size-full stroke-dark-2 group-hover:stroke-dark-1 transition" />
            </m.button>
          </m.span>

          <m.span
            className="absolute left-1/2 -translate-x-1/2 z-2"
            style={{
              opacity,
              pointerEvents,
              transitionDuration,
              bottom: buttonBottom,
              scale: buttonScale,
            }}
          >
            <m.button
              onClick={handleButtonClick}
              className="size-18 place-items-center bg-dark-1 border md:border-3 border-dark-2 rounded-full cursor-pointer"
              initial={{ scale: 1, transition: { duration: 0.1 } }}
              whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
            >
              <IconArrowUpRight className="stroke-2 stroke-light-2" />
            </m.button>
          </m.span>
        </div>
      )}
    </m.div>
  );
};

export default InfiniteMenu;
