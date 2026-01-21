import { P5Canvas } from "@p5-wrapper/react";
import { converter, parse } from "culori";
import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useMemo, useRef } from "react";
import fragShader from "../components/shaders/contour-circles-fs.glsl?raw";
import vertShader from "../components/shaders/contour-circles-vs.glsl?raw";
import { useElementSize } from "../hooks/use-element-size";
import { cn } from "../utils";
import { contourCircleSketch } from "./sketches/contour-circles-sketch";
import { DEBUG_HIDE_SKETCHES } from "../../App";

const ContourCirclesP5 = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    containerClassName?: string;
  } & HTMLMotionProps<"div">
>(({ className, containerClassName, ...motionProps }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(containerRef);
  const lightColor = useMemo(() => {
    const oklchString = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--color-light-1")
      .trim();
    return converter("rgb")(parse(oklchString));
  }, []);
  const darkColor = useMemo(() => {
    const oklchString = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--color-light-2")
      .trim();
    return converter("rgb")(parse(oklchString));
  }, []);

  if (DEBUG_HIDE_SKETCHES) return null;
  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      {...motionProps}
    >
      <div ref={containerRef} className={cn("size-full", containerClassName)}>
        <P5Canvas
          sketch={contourCircleSketch}
          width={width}
          height={height}
          fragShader={fragShader}
          vertShader={vertShader}
          color1={lightColor}
          color2={darkColor}
          error={(e) => (
            <div className="size-full">
              <p className="text-dark-1 text-xl">
                Unfortunately, your device is saying no. :(
              </p>
              <p className="text-dark-1 text-base">{e.message}</p>
            </div>
          )}
        />
      </div>
    </motion.div>
  );
});

export default ContourCirclesP5;
