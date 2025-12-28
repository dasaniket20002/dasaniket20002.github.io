import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "../utils";

export default function Link({
  href,
  children,
  className,
  ...motionProps
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
} & HTMLMotionProps<"a">) {
  return (
    <motion.a href={href} {...motionProps} className={cn("", className)}>
      {children}
    </motion.a>
  );
}
