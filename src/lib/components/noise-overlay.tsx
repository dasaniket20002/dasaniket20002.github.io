import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useMemo } from "react";
import { useWindowSize } from "../hooks/use-window-size";

export default function NoiseOverlay() {
  const { width, height } = useWindowSize();
  const vb = useMemo(
    () => ({ w: width || 100, h: height || 100 }),
    [width, height]
  );
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const opacity = useSpring(
    useTransform(scrollVelocity, [-5000, -1000, 1000, 5000], [0.5, 0, 0, 0.5]),
    { visualDuration: 0.1 }
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-9999">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-full"
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        preserveAspectRatio="none"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>

        <motion.rect
          width="100%"
          height="100%"
          fill="#000"
          style={{ opacity }}
        />
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.25" />
      </svg>
    </div>
  );
}
