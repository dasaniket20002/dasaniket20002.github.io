import { P5Canvas } from "@p5-wrapper/react";
import { converter, parse } from "culori";
import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useMemo } from "react";
import { DEBUG_HIDE_SKETCHES } from "../../App";
import fragShader from "../components/shaders/gol-fs.glsl?raw";
import vertShader from "../components/shaders/gol-vs.glsl?raw";
import { cn, findOptimalSquareTiling } from "../utils";
import { golSketch } from "./sketches/gol-sketch";

const GOLP5 = forwardRef<
  HTMLDivElement,
  { width: number; height: number } & HTMLMotionProps<"div">
>(({ className, width, height, ...motionProps }, ref) => {
  const squareTiles = useMemo(
    () => findOptimalSquareTiling(Math.round(width), Math.round(height)),
    [width, height],
  );

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
      {squareTiles && (
        <section className="size-full">
          <P5Canvas
            sketch={golSketch}
            width={width}
            height={height}
            aliveColor={darkColor}
            deadColor={lightColor}
            cellSize={squareTiles.size * 4}
            vertShader={vertShader}
            fragShader={fragShader}
          />
        </section>
      )}
    </motion.div>
  );
});

export default GOLP5;
