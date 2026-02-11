import { animate, useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { cn, preloadWithProgress, wait } from "../../utils";

const ASSETS = [
  "/assets/models/round-foil-balloon-portrait.gltf",
  "/assets/models/round-foil-balloon-portrait.bin",
  "/assets/models/Portrait.png",
  "/assets/portrait/Portrait-FULL.png",
  "/assets/logos/IDZ Digital.png",
  "/assets/logos/JMAN Group.png",
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
