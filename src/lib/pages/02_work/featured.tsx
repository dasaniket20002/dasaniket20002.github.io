import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";
import { cn } from "../../utils";
import InfiniteMenu from "../../components/infinite-menu/infinite-menu";

const Featured = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  return (
    <motion.section
      ref={ref}
      {...motionProps}
      className={cn("relative size-full", className)}
    >
      <InfiniteMenu
        scale={1}
        className="mask-t-from-80% mask-b-from-90% mask-l-from-95% mask-r-from-95%"
      />
    </motion.section>
  );
});

export default Featured;
