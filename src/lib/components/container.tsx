import { forwardRef } from "react";
import { cn } from "../utils";
import { motion, type HTMLMotionProps } from "motion/react";

type ContainerProps = {
  dataBGTheme?: "light" | "dark";
  className?: string;
  children?: React.ReactNode;
} & HTMLMotionProps<"div">;

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ dataBGTheme = "light", className, children, ...motionProps }, ref) => {
    return (
      <motion.div
        ref={ref}
        data-bg-theme={dataBGTheme}
        className={cn(
          "h-page m-page",
          dataBGTheme === "light" ? "bg-light-1" : "bg-dark-2",
          className
        )}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

Container.displayName = "Container";

export default Container;
