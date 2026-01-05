import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useEffect, useRef } from "react";
import { useElementSize } from "../hooks/use-element-size";
import { cn } from "../utils";

export type SectionContainerProps = {
  className?: string;
  title: string;
  subTitle: string;
  children?: React.ReactNode;
  theme?: "light" | "dark";
  onHeaderHeightChange?: (height: number) => void;
} & HTMLMotionProps<"div">;

const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  (
    {
      className,
      children,
      title,
      subTitle,
      theme = "light",
      onHeaderHeightChange,
      ...motionProps
    },
    ref
  ) => {
    const headRef = useRef<HTMLDivElement>(null);
    const { height: headHeight } = useElementSize(headRef);

    useEffect(() => {
      onHeaderHeightChange?.(headHeight);
    }, [headHeight, onHeaderHeightChange]);

    return (
      <motion.div
        ref={ref}
        {...motionProps}
        className={cn(
          "min-h-screen w-full relative [&>section]:min-h-[calc(100vh-var(--head-height))]",
          theme === "light" && "[&>section]:bg-dark-2 [&>section]:text-light-2",
          theme === "dark" && "[&>section]:bg-light-1 [&>section]:text-dark-1",
          className
        )}
        style={{ "--head-height": `${headHeight}px` } as React.CSSProperties}
      >
        <div
          ref={headRef}
          data-bg-theme={theme}
          className={cn(
            "flex justify-between items-end px-4 md:px-16 font-think-loved sticky top-0 pt-page z-9997",
            theme === "light" && "bg-light-1",
            theme === "dark" && "bg-dark-2"
          )}
        >
          <h2
            className={cn(
              "text-xl md:text-[min(3vw,2.5rem)] trim-text-caps -mb-px mask-b-from-50% opacity-80",
              theme === "light" && "text-light-2",
              theme === "dark" && "text-dark-1"
            )}
          >
            {subTitle}
          </h2>
          <h1
            className={cn(
              "text-5xl md:text-[min(7vw,6rem)] trim-text-caps -mb-px",
              theme === "light" && "text-dark-2",
              theme === "dark" && "text-light-1"
            )}
          >
            {title}
          </h1>
        </div>
        {children}
      </motion.div>
    );
  }
);

export default SectionContainer;
