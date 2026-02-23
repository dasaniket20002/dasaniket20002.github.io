import { useEffect, useRef } from "react";
import {
  ScrollVelocityMasonry,
  type MasonryImage,
} from "../../components/scroll-velocity-masonry";
import { cn } from "../../utils";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { useMotionTemplate, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";

const ALL_IMAGES: MasonryImage[] = [
  {
    src: "assets/works/blender/antigravity_cmp.png",
    alt: "antigravity",
    name: "Antigravity",
  },
  {
    src: "assets/works/blender/aquarium_of_life_cmp.png",
    alt: "aquarium_of_life",
    name: "Aquarium of Life",
  },
  {
    src: "assets/works/blender/bathroom_unclean_cmp.png",
    alt: "bathroom_unclean",
    name: "Bathroom",
  },
  {
    src: "assets/works/blender/bathroom_woman_cmp.png",
    alt: "bathroom_woman",
    name: "Subject A",
  },
  {
    src: "assets/works/blender/beach_bottle_cmp.png",
    alt: "beach_bottle",
    name: "Lost Bottle",
  },
  {
    src: "assets/works/blender/black_hole_cmp.png",
    alt: "black_hole",
    name: "Black Hole",
  },
  {
    src: "assets/works/blender/burning_butterfly_cmp.png",
    alt: "burning_butterfly",
    name: "Burning Butterfly",
  },
  {
    src: "assets/works/blender/candy_cmp.png",
    alt: "candy",
    name: "Candy",
  },
  {
    src: "assets/works/blender/car_ruins_cmp.png",
    alt: "car_ruins",
    name: "Car Ruins",
  },
  {
    src: "assets/works/blender/cyberpunk_01_cmp.png",
    alt: "cyberpunk_01",
    name: "Cyberpunk",
  },
  {
    src: "assets/works/blender/cyberpunk_02_cmp.png",
    alt: "cyberpunk_02",
    name: "Cyberpunk",
  },
  {
    src: "assets/works/blender/data_cube_cmp.png",
    alt: "data_cube",
    name: "Data Cube",
  },
  {
    src: "assets/works/blender/detained_cmp.png",
    alt: "detained",
    name: "Detained",
  },
  {
    src: "assets/works/blender/detatched_cmp.png",
    alt: "detatched",
    name: "Detatched",
  },
  {
    src: "assets/works/blender/distort_cmp.png",
    alt: "distort",
    name: "Distort",
  },
  {
    src: "assets/works/blender/hallows_cmp.png",
    alt: "hallows",
    name: "Hallows",
  },
  {
    src: "assets/works/blender/hand_and_rose_cmp.png",
    alt: "hand_and_rose",
    name: "For You",
  },
  {
    src: "assets/works/blender/life_support_cmp.png",
    alt: "life_support",
    name: "Life Support",
  },
  {
    src: "assets/works/blender/lost_01_cmp.png",
    alt: "lost_01",
    name: "Lost",
  },
  {
    src: "assets/works/blender/lost_02_cmp.png",
    alt: "lost_02",
    name: "Lost",
  },
  {
    src: "assets/works/blender/lost_03_cmp.png",
    alt: "lost_03",
    name: "Lost",
  },
  {
    src: "assets/works/blender/omw_cmp.png",
    alt: "omw",
    name: "OMW",
  },
  {
    src: "assets/works/blender/piano_ruins_cmp.png",
    alt: "piano_ruins",
    name: "Ruins",
  },
  {
    src: "assets/works/blender/sunken_cmp.png",
    alt: "sunken",
    name: "Sunken",
  },
  {
    src: "assets/works/blender/the_door_cmp.png",
    alt: "the_door",
    name: "The Door",
  },
];

export default function Hobby({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const titleRevealY = useTransform(scrollYProgress, [0, 0.25], ["100%", "0%"]);
  const _titleRevealBlur = useTransform(
    scrollYProgress,
    [0, 0.25, 0.8, 1],
    [3, 0, 0, 3],
  );
  const titleRevealBlur = useMotionTemplate`blur(${_titleRevealBlur}px)`;

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-dvh w-full px-16 md:px-32 py-16 flex flex-col gap-8",
        className,
      )}
    >
      <div className="relative mask-b-from-80%">
        <m.h3
          style={{ y: titleRevealY, filter: titleRevealBlur }}
          className="text-4xl font-width-125 font-light tracking-wide"
        >
          HOBBY
        </m.h3>
      </div>
      <ScrollVelocityMasonry
        images={ALL_IMAGES}
        baseVelocity={3}
        gap={12}
        className="h-full mask-t-from-95% mask-b-from-95%"
      />
    </div>
  );
}
