import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";
import { cn } from "../utils";

export type SectionContainerProps = {
  className?: string;
  title: string;
  subTitle: string;
  children?: React.ReactNode;
  theme?: "light" | "dark";
} & HTMLMotionProps<"div">;

const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  (
    { className, children, title, subTitle, theme = "light", ...motionProps },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        {...motionProps}
        className={cn(
          "relative min-h-screen w-full h-full",
          "[&>section]:min-h-[calc(100vh-var(--min-section-header-height))] [&>section]:md:min-h-[calc(100vh-var(--section-header-height))]",
          theme === "light" && "[&>section]:bg-dark-2 [&>section]:text-light-2",
          theme === "dark" && "[&>section]:bg-light-1 [&>section]:text-dark-1",
          className
        )}
      >
        <div
          data-bg-theme={theme}
          className={cn(
            "flex justify-between items-end px-4 md:px-16 font-think-loved sticky top-0 pt-(--header-height) z-9997 h-(--min-section-header-height) md:h-(--section-header-height)",
            theme === "light" && "bg-light-1",
            theme === "dark" && "bg-dark-2"
          )}
        >
          <h2
            className={cn(
              "text-xl md:text-4xl trim-text-caps -mb-px mask-b-from-50% opacity-80",
              theme === "light" && "text-light-2",
              theme === "dark" && "text-dark-1"
            )}
          >
            {subTitle}
          </h2>
          <h1
            className={cn(
              "text-5xl md:text-8xl trim-text-caps -mb-px",
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
