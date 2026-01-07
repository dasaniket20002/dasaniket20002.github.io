import { P5Canvas } from "@p5-wrapper/react";
import {
  motion,
  useMotionValue,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { forwardRef, useCallback, useState } from "react";
import { cn } from "../utils";
import { infiniteMenuSketch } from "./sketches/infinite-menu-sketch";
import fragShader from "../components/shaders/infinite-menu-fs.glsl?raw";
import vertShader from "../components/shaders/infinite-menu-vs.glsl?raw";
import SVGText from "./svg-text";
import { IconArrowUpRight } from "@tabler/icons-react";

export type MenuItem = {
  image: string;
  link: string;
  title: string;
  description: string;
};

export type InfiniteMenuProps = {
  items?: MenuItem[];
  scale?: number;
  className?: string;
} & HTMLMotionProps<"div">;

const defaultItems: MenuItem[] = [
  {
    image: `${window.location.origin}/assets/illustrations/undraw_under-construction_hdrn.png`,
    link: "https://google.com/", // TODO: Literally download my resume
    title: "WIP. Literally.",
    description: "Your project can live here.",
  },
];

const InfiniteMenuP5 = forwardRef<HTMLDivElement, InfiniteMenuProps>(
  ({ items = defaultItems, scale = 1.0, className, ...motionProps }, ref) => {
    const [activeItem, setActiveItem] = useState<MenuItem | null>(items[0]);
    const isMoving = useMotionValue(0);

    const handleActiveItemChange = useCallback(
      (index: number) => {
        if (items.length > 0) {
          const itemIndex = index % items.length;
          setActiveItem(items[itemIndex]);
        }
      },
      [items]
    );

    const handleMovementChange = useCallback(
      (moving: boolean) => isMoving.set(moving ? 1 : 0),
      [isMoving]
    );

    const handleButtonClick = () => {
      if (!activeItem?.link) return;
      if (activeItem.link.startsWith("http")) {
        window.open(activeItem.link, "_blank");
      } else {
        console.log("Internal route:", activeItem.link);
      }
    };

    const opacity = useTransform(isMoving, [0, 1], [1, 0]);
    const pointerEvents = useTransform(isMoving, [0, 1], ["auto", "none"]);
    const transitionDuration = useTransform(
      isMoving,
      [0, 1],
      ["500ms", "100ms"]
    );

    const titleX = useTransform(isMoving, [0, 1], ["0%", "-4rem"]);
    const descriptionX = useTransform(isMoving, [0, 1], ["-4rem", "0rem"]);
    const buttonBottom = useTransform(isMoving, [0, 1], ["3rem", "-5rem"]);
    const buttonScale = useTransform(isMoving, [0, 1], [1, 0]);

    return (
      <motion.div
        ref={ref}
        {...motionProps}
        className={cn("relative w-full h-full", className)}
      >
        <P5Canvas
          sketch={infiniteMenuSketch}
          items={items}
          scale={scale}
          onActiveItemChange={handleActiveItemChange}
          onMovementChange={handleMovementChange}
          fragShader={fragShader}
          vertShader={vertShader}
        />
        {activeItem && (
          <div className="absolute inset-0 pointer-events-none">
            <SVGText
              className="select-none absolute font-think-loved text-4xl md:text-[4rem] left-4 md:left-[1.6em] top-1/2 -translate-y-1/2 fill-light-2 stroke-dark-2 stroke-8"
              style={{
                opacity,
                pointerEvents,
                transitionDuration,
                x: titleX,
              }}
            >
              {activeItem.title}
            </SVGText>

            <motion.p
              className={cn(
                "select-none max-w-32 md:max-w-64 absolute text-lg md:text-[1.5rem] top-1/2 -translate-y-1/2 right-4 md:right-[1.6em] text-light-2 text-right",
                "text-shadow-[0px_0px_2px_var(--tw-text-shadow-color),0px_0px_2px_var(--tw-text-shadow-color),0px_0px_8px_var(--tw-text-shadow-color)] text-shadow-dark-2"
              )}
              style={{
                opacity,
                pointerEvents,
                transitionDuration,
                x: descriptionX,
              }}
            >
              {activeItem.description}
            </motion.p>

            <motion.div
              onClick={handleButtonClick}
              className="absolute left-1/2 -translate-x-1/2 z-10 size-14 grid place-items-center bg-dark-1 border-4 border-dark-2 rounded-full cursor-pointer"
              whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
              style={{
                opacity,
                pointerEvents,
                transitionDuration,
                bottom: buttonBottom,
                scale: buttonScale,
              }}
            >
              <IconArrowUpRight className="stroke-2 stroke-light-2" />
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  }
);

export default InfiniteMenuP5;
