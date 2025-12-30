import { motion, type SVGMotionProps } from "motion/react";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../utils";

type SVGTextProps = {
  children?: string;
  className?: string;
} & SVGMotionProps<SVGSVGElement>;

const SVGText = forwardRef<SVGSVGElement, SVGTextProps>(
  ({ children, className, ...motionProps }, ref) => {
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
      <motion.svg
        ref={ref}
        viewBox={`${boxDimm.x} ${boxDimm.y} ${boxDimm.w} ${boxDimm.h}`}
        width={boxDimm.w}
        height={boxDimm.h}
        className={cn("relative overflow-visible", className)}
        {...motionProps}
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
      </motion.svg>
    );
  }
);

export default SVGText;
