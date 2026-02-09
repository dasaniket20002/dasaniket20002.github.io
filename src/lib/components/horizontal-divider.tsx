import { type HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef } from "react";
import { cn } from "../utils";

const HorizontalDivider = forwardRef<
  HTMLDivElement,
  { className?: string } & HTMLMotionProps<"div">
>(({ className, ...motionProps }, ref) => {
  return (
    <m.div
      ref={ref}
      {...motionProps}
      className={cn("h-px bg-light-2 mask-l-from-3 mask-r-from-3", className)}
    />
  );
});

export default HorizontalDivider;
