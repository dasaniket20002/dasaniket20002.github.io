import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";
import { cn } from "../../utils";
import { GameOfLifeCanvas } from "./game-of-life-canvas";

export const GameOfLife = forwardRef<
  HTMLDivElement,
  Omit<HTMLMotionProps<"div">, "children">
>(({ className, ...motionProps }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("relative size-full", className)}
      {...motionProps}
    >
      <GameOfLifeCanvas />
    </motion.div>
  );
});
