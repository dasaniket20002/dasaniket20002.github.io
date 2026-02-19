import { animate, clamp, useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { cn, wait } from "../../utils";

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
    const sequence = async () => {
      await wait(500);
      await animate(count, 85, {
        duration: 1.25,
        ease: "easeInOut",
      });
      await wait(150);
      await animate(count, 100, {
        duration: 0.25,
        ease: "easeInOut",
      });
      await wait(100);
      onComplete();
    };
    sequence();
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
