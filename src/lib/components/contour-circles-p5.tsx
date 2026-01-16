import { P5Canvas } from "@p5-wrapper/react";
import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import fragShader from "../components/shaders/contour-circles-fs.glsl?raw";
import vertShader from "../components/shaders/contour-circles-vs.glsl?raw";
import { useElementSize } from "../hooks/use-element-size";
import { cn } from "../utils";
import { contourCircleSketch } from "./sketches/contour-circles-sketch";
import { converter, parse } from "culori";

const ContourCirclesP5 = forwardRef<
  HTMLDivElement,
  { className?: string } & HTMLMotionProps<"div">
>(({ className, ...motionProps }, ref) => {
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
      .getPropertyValue("--color-dark-2")
      .trim();
    return converter("rgb")(parse(oklchString));
  }, []);

  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);
  return (
    <motion.div
      ref={containerRef}
      className={cn("relative", className)}
      {...motionProps}
    >
      <P5Canvas
        sketch={contourCircleSketch}
        width={width}
        height={height}
        fragShader={fragShader}
        vertShader={vertShader}
        color1={lightColor}
        color2={darkColor}
      />
    </motion.div>
  );
});

export default ContourCirclesP5;
