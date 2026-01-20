import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useState } from "react";
import { cn } from "../utils";
import TextRoll from "./text-roll";
import { useLenis } from "lenis/react";
import { useStickySnap } from "../hooks/use-sticky-snap";

type LinkProps = {
  href: string;
  children?: string;
  className?: string;
  theme?: "light" | "dark";
  underlineHeight?: number;
} & HTMLMotionProps<"a">;

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      children,
      className,
      theme = "light",
      underlineHeight = 1,
      ...motionProps
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState(false);
    const lenis = useLenis();
    const { lockSnap, unlockSnap } = useStickySnap();

    return (
      <motion.a
        ref={ref}
        href={href}
        {...motionProps}
        className={cn(
          "relative md:p-1 py-1 flex transition-colors",
          theme === "light" && "text-dark-1",
          theme === "dark" && "text-light-2",
          className,
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          e.preventDefault();
          lockSnap();
          lenis?.scrollTo(href, { onComplete: unlockSnap });
        }}
        style={
          {
            "--underline-height": `${underlineHeight}px`,
          } as React.CSSProperties
        }
      >
        <AnimatePresence mode="popLayout">
          {hovered && (
            <motion.span
              key="underline"
              initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
              animate={{
                clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 100%)"],
              }}
              exit={{
                clipPath: [
                  "inset(0% 0% 0% 100%)",
                  "inset(0% 0% 0% 0%)",
                  "inset(0% 100% 0% 0%)",
                ],
              }}
              transition={{ ease: "backOut", duration: 0.5 }}
              className={cn(
                "absolute left-0 md:left-1 right-0 md:right-1 bottom-0 h-(--underline-height) opacity-75",
                theme === "light" && "bg-dark-1",
                theme === "dark" && "bg-light-2",
              )}
            />
          )}
          {hovered && (
            <motion.span
              key="background"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              exit={{ clipPath: "inset(0 100% 0 0)" }}
              transition={{ ease: "backOut" }}
              className={cn(
                "absolute left-0 md:left-1 right-0 md:right-1 bottom-(--underline-height) top-0",
                theme === "light" && "bg-light-1",
                theme === "dark" && "bg-dark-2",
              )}
            />
          )}
        </AnimatePresence>
        <TextRoll hovered={hovered}>{children}</TextRoll>
      </motion.a>
    );
  },
);

export default Link;
