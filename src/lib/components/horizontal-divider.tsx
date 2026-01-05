import { forwardRef } from "react";
import { cn } from "../utils";
import { motion, type HTMLMotionProps } from "motion/react";

const HorizontalDivider = forwardRef<
  HTMLDivElement,
  { className?: string } & HTMLMotionProps<"div">
>(({ className, ...motionProps }, ref) => {
  return (
    <motion.div
      ref={ref}
      {...motionProps}
      className={cn("h-px bg-light-2 mask-l-from-3 mask-r-from-3", className)}
    />
  );
});

export default HorizontalDivider;
