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
        "place-content-center place-items-center h-[calc(100vh-var(--head-height))] px-8 py-1 @container-[size]",
        className
      )}
    >
      {/* aspect ratio = 34 / 21 (w / h - to keep cells square)  */}
      {/* 21 + 8 + 3 + 1 + 1 = 34  */}
      {/* 13 + 5 + 2 + 1 = 21  */}
      {/* Skip each fibonacci number */}
      <div
        className={cn(
          "grid [@container(min-aspect-ratio:34/21)]:h-full [@container(max-aspect-ratio:34/21)]:w-full",
          "aspect-21/34 grid-rows-[8fr_1fr_1fr_3fr_21fr] grid-cols-[5fr_1fr_2fr_13fr]",
          "lg:aspect-34/21 lg:grid-cols-[21fr_3fr_1fr_1fr_8fr] lg:grid-rows-[5fr_1fr_2fr_13fr]"
        )}
      >
        <div className="grid col-span-full row-span-full grid-cols-subgrid grid-rows-subgrid">
          <span
            className={cn(
              "bg-red-300",
              "row-start-5 col-start-1 row-end-6 col-end-5",
              "lg:row-start-1 lg:col-start-1 lg:row-end-5 lg:col-end-2"
            )}
          />
          <span
            className={cn(
              "bg-orange-300",
              "row-start-1 col-start-4 row-end-5 col-end-5",
              "lg:row-start-4 lg:col-start-2 lg:row-end-5 lg:col-end-6"
            )}
          />
          <span
            className={cn(
              "bg-teal-300",
              "row-start-1 col-start-1 row-end-2 col-end-4",
              "lg:row-start-1 lg:col-start-5 lg:row-end-4 lg:col-end-6"
            )}
          />
          <span
            className={cn(
              "bg-green-300",
              "row-start-2 col-start-1 row-end-5 col-end-2",
              "lg:row-start-1 lg:col-start-2 lg:row-end-2 lg:col-end-5"
            )}
          />
          <span
            className={cn(
              "bg-cyan-300",
              "row-start-4 col-start-2 row-end-5 col-end-4",
              "lg:row-start-2 lg:col-start-2 lg:row-end-4 lg:col-end-3"
            )}
          />
          <span
            className={cn(
              "bg-amber-300",
              "row-start-2 col-start-3 row-end-4 col-end-4",
              "lg:row-start-3 lg:col-start-3 lg:row-end-4 lg:col-end-5"
            )}
          />
          <span
            className={cn(
              "bg-emerald-300",
              "row-start-2 col-start-2 row-end-3 col-end-3",
              "lg:row-start-2 lg:col-start-3 lg:row-end-3 lg:col-end-4"
            )}
          />
          <span
            className={cn(
              "bg-blue-300",
              "row-start-3 col-start-2 row-end-4 col-end-3",
              "lg:row-start-2 lg:col-start-4 lg:row-end-3 lg:col-end-5"
            )}
          />
        </div>
      </div>
    </motion.section>
  );
});

export default Experience2;
