import { animate, clamp, useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { cn, preloadWithProgress, wait } from "../../utils";

const ASSETS = [
  "/assets/portrait/Portrait-FULL.png",
  "/assets/logos/IDZ Digital.png",
  "/assets/logos/JMAN Group.png",
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
    preloadWithProgress(ASSETS, (p) => {
      animate(count, p, {
        duration: 0.25,
        ease: "easeInOut",
      });
    })
      .then(async () => {
        await wait(500);
        onComplete();
      })
      .catch(console.error);
  }, [count, onComplete]);

  count.on("change", (latest) => {
    setDisplay(Math.round(clamp(0, 100, latest)));
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
