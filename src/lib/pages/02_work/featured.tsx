import { type HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, lazy, Suspense } from "react";
import { cn } from "../../utils";

const InfiniteMenu = lazy(
  () => import("../../components/infinite-menu/infinite-menu"),
);

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
      <Suspense fallback={null}>
        <InfiniteMenu scale={1} />
      </Suspense>
    </m.section>
  );
});

export default Featured;
