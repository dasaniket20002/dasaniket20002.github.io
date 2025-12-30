import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "../utils";
import { forwardRef } from "react";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
} & HTMLMotionProps<"a">;

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, ...motionProps }, ref) => {
    return (
      <motion.a
        ref={ref}
        href={href}
        {...motionProps}
        className={cn("", className)}
      >
        {children}
      </motion.a>
    );
  }
);

export default Link;
