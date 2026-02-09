import { type HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef } from "react";
import InfiniteMenu from "../../components/infinite-menu/infinite-menu";
import { cn } from "../../utils";

const Featured = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  return (
    <m.section
      ref={ref}
      {...motionProps}
      className={cn("relative size-full", className)}
    >
      <InfiniteMenu
        scale={1}
        className="mask-t-from-80% mask-b-from-90% mask-l-from-95% mask-r-from-95%"
      />
    </m.section>
  );
});

export default Featured;
