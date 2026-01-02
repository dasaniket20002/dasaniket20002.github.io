import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useState } from "react";
import { cn } from "../utils";
import TextRoll from "./text-roll";

type LinkProps = {
  href: string;
  text?: string;
  className?: string;
  theme?: "light" | "dark";
} & HTMLMotionProps<"a">;

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, text, className, theme = "light", ...motionProps }, ref) => {
    const [hovered, setHovered] = useState(false);
    return (
      <motion.a
        ref={ref}
        href={href}
        {...motionProps}
        className={cn(
          "relative md:p-1 py-1 flex transition-colors",
          theme === "light" && "text-dark-1",
          theme === "dark" && "text-light-2",
          className
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence mode="popLayout">
          {hovered && (
            <motion.span
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              exit={{ clipPath: "inset(0 100% 0 0)" }}
              transition={{ ease: "backOut" }}
              className={cn(
                "absolute left-0 md:left-1 right-0 md:right-1 bottom-0 h-px mask-l-from-0",
                theme === "light" && "bg-dark-1",
                theme === "dark" && "bg-light-1"
              )}
            />
          )}
        </AnimatePresence>
        <TextRoll hovered={hovered}>{text}</TextRoll>
      </motion.a>
    );
  }
);

export default Link;
