import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "../utils";

export default function SVGText({
  children,
  className,
}: {
  children?: string;
  className?: string;
}) {
  const textRef = useRef<SVGTextElement>(null);
  const [boxDimm, setBoxDimm] = useState({ x: 0, y: 0, w: 0, h: 0 });

  useLayoutEffect(() => {
    let cancelled = false;

    const measure = async () => {
      await document.fonts.ready;

      // double RAF ensures layout is fully settled
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!textRef.current || cancelled) return;

          const bbox = textRef.current.getBBox();
          setBoxDimm({
            x: bbox.x,
            y: bbox.y,
            w: bbox.width,
            h: bbox.height,
          });
        });
      });
    };

    measure();
    window.addEventListener("resize", measure);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
    };
  }, [children, className]);

  return (
    <svg
      viewBox={`${boxDimm.x} ${boxDimm.y} ${boxDimm.w} ${boxDimm.h}`}
      width={boxDimm.w}
      height={boxDimm.h}
      className={cn("relative overflow-visible", className)}
    >
      <text
        ref={textRef}
        x="0"
        y="0"
        dominantBaseline="hanging"
        strokeLinejoin="round"
        strokeLinecap="round"
        paintOrder="stroke"
      >
        {children}
      </text>
    </svg>
  );
}
