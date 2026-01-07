import { P5Canvas } from "@p5-wrapper/react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useState } from "react";
import { cn } from "../utils";
import { infiniteMenuSketch } from "./sketches/infinite-menu-sketch";
import fragShader from "../components/shaders/infinite-menu-fs.glsl?raw";
import vertShader from "../components/shaders/infinite-menu-vs.glsl?raw";

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
};

const defaultItems: MenuItem[] = [
  {
    image: "https://picsum.photos/900/900?grayscale",
    link: "https://google.com/",
    title: "Default Item",
    description: "Pass items array to show more",
  },
];

const InfiniteMenu: React.FC<InfiniteMenuProps> = ({
  items = defaultItems,
  scale = 1.0,
  className,
}) => {
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
  const transitionDuration = useTransform(isMoving, [0, 1], ["500ms", "100ms"]);

  const titleX = useTransform(isMoving, [0, 1], ["0%", "-20%"]);
  const descriptionX = useTransform(isMoving, [0, 1], ["-90%", "-60%"]);
  const buttonBottom = useTransform(isMoving, [0, 1], ["3rem", "-5rem"]);
  const buttonScale = useTransform(isMoving, [0, 1], [1, 0]);

  return (
    <div className={cn("relative w-full h-full", className)}>
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
          <motion.h2
            className="select-none absolute font-black text-4xl md:text-[4rem] left-4 md:left-[1.6em] top-1/2 transform -translate-y-1/2 text-white"
            style={{
              opacity,
              pointerEvents,
              transitionDuration,
              x: titleX,
            }}
          >
            {activeItem.title}
          </motion.h2>

          <motion.p
            className="select-none absolute max-w-[10ch] text-lg md:text-[1.5rem] top-1/2 right-4 md:right-[1%] text-white/80 text-right"
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
            className="absolute left-1/2 z-10 w-14 h-14 grid place-items-center bg-cyan-400 border-4 border-black rounded-full cursor-pointer"
            whileHover={{ scale: 1.1 }}
            style={{
              opacity,
              pointerEvents,
              transitionDuration,
              bottom: buttonBottom,
              scale: buttonScale,
            }}
          >
            <span className="select-none relative text-black top-0.5 text-2xl font-bold">
              ↗
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InfiniteMenu;
