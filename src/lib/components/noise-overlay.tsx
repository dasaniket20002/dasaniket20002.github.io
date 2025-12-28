import { useMemo } from "react";
import { useWindowSize } from "../hooks/useWindowSize";

export default function NoiseOverlay() {
  const { width, height } = useWindowSize();
  const vb = useMemo(
    () => ({ w: width || 100, h: height || 100 }),
    [width, height]
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

        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.4" />
      </svg>
    </div>
  );
}
