import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";
import { cn } from "../../utils";

const Experience2 = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  return (
    <motion.section
      ref={ref}
      {...motionProps}
      className={cn(
        "place-content-center place-items-center h-[calc(100vh-var(--head-height))]",
        className
      )}
    >
      {/* aspect ratio = 34 / 21 (w / h - to keep cells square)  */}
      {/* 21 + 8 + 3 + 1 + 1 = 34  */}
      {/* 13 + 5 + 2 + 1 = 21  */}
      {/* Skip each fibonacci number */}
      <div className="h-full aspect-34/21 grid grid-cols-[21fr_3fr_1fr_1fr_8fr] grid-rows-[5fr_1fr_2fr_13fr]"></div>
    </motion.section>
  );
});

export default Experience2;
