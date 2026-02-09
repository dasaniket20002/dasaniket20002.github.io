import { animate, useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { cn, preloadImage, wait } from "../../utils";

const ALL_IMAGES = [
  "/assets/works/blender/aquarium_of_life_cmp.png",
  "/assets/works/blender/bathroom_woman_cmp.png",
  "/assets/works/blender/life_support_cmp.png",
  "/assets/works/blender/lost_03_cmp.png",
  "/assets/works/blender/sunken_cmp.png",
];

export default function Counter({
  onComplete,
  className,
}: {
  onComplete: () => void;
  className?: string;
}) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const increment = 100 / ALL_IMAGES.length;

    // Start all image loads in parallel
    const promises = ALL_IMAGES.map((imgSrc) =>
      preloadImage(imgSrc).finally(() => {
        loadedCount += increment;
        animate(count, loadedCount, {
          duration: 0.25,
          ease: "easeInOut",
        });
      }),
    );

    Promise.all(promises).then(async () => {
      await wait(1000);
      onComplete();
    });
  }, [count, onComplete]);

  count.on("change", (latest) => {
    setDisplay(Math.round(latest));
  });

  const top = useTransform(count, [0, 100], ["100%", "0%"]);
  const y = useTransform(count, [0, 100], ["-100%", "0%"]);

  return (
    <m.p
      style={{ top, y }}
      className={cn("absolute text-5xl text-center", className)}
    >
      {display}
    </m.p>
  );
}
