import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimationControls } from "motion/react";

export type MenuItemData = {
  link: string;
  text: string;
  image: string;
};

type FlowingMenuProps = {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
};

type MenuItemProps = {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  isFirst: boolean;
} & MenuItemData;

const demoItems: MenuItemData[] = [
  {
    link: "#",
    text: "Mojave",
    image: "https://picsum.photos/600/400?random=1",
  },
  {
    link: "#",
    text: "Sonoma",
    image: "https://picsum.photos/600/400?random=2",
  },
  {
    link: "#",
    text: "Monterey",
    image: "https://picsum.photos/600/400?random=3",
  },
  {
    link: "#",
    text: "Sequoia",
    image: "https://picsum.photos/600/400?random=4",
  },
];

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = demoItems,
  speed = 30,
  textColor = "#fff",
  bgColor = "#060010",
  marqueeBgColor = "#fff",
  marqueeTextColor = "#060010",
  borderColor = "#fff",
}) => {
  return (
    <div
      className="size-full overflow-hidden flex flex-col"
      style={{ backgroundColor: bgColor }}
    >
      {items.map((item, idx) => (
        <MenuItem
          key={idx}
          {...item}
          speed={speed}
          textColor={textColor}
          marqueeBgColor={marqueeBgColor}
          marqueeTextColor={marqueeTextColor}
          borderColor={borderColor}
          isFirst={idx === 0}
        />
      ))}
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeContentRef = useRef<HTMLDivElement>(null);
  const marqueeControls = useAnimationControls();
  const innerControls = useAnimationControls();
  const [repetitions, setRepetitions] = useState(4);
  const [contentWidth, setContentWidth] = useState(0);

  const transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
  ): "top" | "bottom" => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist =
      Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeContentRef.current) return;
      const firstPart = marqueeContentRef.current.querySelector(
        ".marquee-part",
      ) as HTMLElement;
      if (!firstPart) return;
      const partWidth = firstPart.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / partWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const measure = () => {
      if (!marqueeContentRef.current) return;
      const firstPart = marqueeContentRef.current.querySelector(
        ".marquee-part",
      ) as HTMLElement;
      if (!firstPart) return;
      const width = firstPart.offsetWidth;
      if (width > 0) setContentWidth(width);
    };
    const timer = setTimeout(measure, 50);
    return () => clearTimeout(timer);
  }, [text, image, repetitions]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height,
    );

    marqueeControls.set({ y: edge === "top" ? "-101%" : "101%" });
    innerControls.set({ y: edge === "top" ? "101%" : "-101%" });
    marqueeControls.start({ y: "0%", transition });
    innerControls.start({ y: "0%", transition });
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height,
    );

    marqueeControls.start({
      y: edge === "top" ? "-101%" : "101%",
      transition,
    });
    innerControls.start({
      y: edge === "top" ? "101%" : "-101%",
      transition,
    });
  };

  return (
    <div
      className="relative overflow-hidden text-center h-10 py-1"
      ref={itemRef}
      //   style={{ borderTop: isFirst ? "none" : `1px solid ${borderColor}` }}
      style={{ borderBottom: `1px solid ${borderColor}` }}
    >
      <a
        className="px-6 flex items-center justify-start h-full relative cursor-pointer uppercase no-underline font-semibold text-base"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        {text}
      </a>

      {/* Outer marquee wrapper — animated on Y for edge-aware reveal/hide */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        animate={marqueeControls}
        initial={{ y: "101%" }}
        style={{ backgroundColor: marqueeBgColor }}
      >
        {/* Inner Y wrapper — counter-animated on Y for the sliding effect */}
        <motion.div className="h-full" animate={innerControls}>
          {/* Scrolling content — continuously animated on X */}
          <motion.div
            ref={marqueeContentRef}
            className="h-full w-fit flex"
            animate={contentWidth > 0 ? { x: -contentWidth } : undefined}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: speed,
                ease: "linear",
              },
            }}
          >
            {[...Array(repetitions)].map((_, idx) => (
              <div
                className="marquee-part flex items-center shrink-0"
                key={idx}
                style={{ color: marqueeTextColor }}
              >
                <span className="whitespace-nowrap uppercase font-normal text-base leading-none px-[1vw]">
                  {text}
                </span>
                <div
                  className="w-64 h-8/10 my-[2em] mx-[1em] py-[1em] rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FlowingMenu;
