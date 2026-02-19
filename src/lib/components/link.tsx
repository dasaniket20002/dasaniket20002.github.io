import { useLenis } from "lenis/react";
import { AnimatePresence, type HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useCallback, useState } from "react";
import { useStickySnap } from "../hooks/use-sticky-snap";
import { cn } from "../utils";
import TextRoll from "./text-roll";

type LinkProps = {
  children?: string;
  className?: string;
  theme?: "light" | "dark";
  underlineThickness?: number;
  hovered?: boolean;
  setHovered?: (h: boolean) => void;
  showBG?: boolean;
} & HTMLMotionProps<"a">;

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      children,
      className,
      theme = "light",
      underlineThickness = 1,
      hovered,
      setHovered,
      showBG = true,
      ...motionProps
    },
    ref,
  ) => {
    const [_hovered, _setHovered] = useState(false);
    const lenis = useLenis();
    const { lockSnap, unlockSnap } = useStickySnap();

    const __hovered = hovered === undefined ? _hovered : hovered;
    const __setHovered = setHovered ? setHovered : _setHovered;

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (!href) return;

        if (href.startsWith("http")) {
          window.open(href, "_blank");
        } else {
          lockSnap();
          lenis?.scrollTo(href, {
            onComplete: unlockSnap,
            lock: true,
          });
        }
      },
      [href, lenis, lockSnap, unlockSnap],
    );

    return (
      <m.a
        ref={ref}
        href={href}
        className={cn(
          "relative md:p-1 py-1 flex transition-colors cursor-pointer disabled:cursor-not-allowed",
          theme === "light" ? "text-dark-d" : "text-light-l",
          className,
        )}
        onMouseEnter={() => __setHovered(true)}
        onMouseLeave={() => __setHovered(false)}
        onClick={handleClick}
        style={
          {
            "--underline-height": `${underlineThickness}px`,
          } as React.CSSProperties
        }
        {...motionProps}
      >
        <AnimatePresence mode="popLayout">
          {__hovered && (
            <m.span
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
                theme === "light" ? "bg-dark-d" : "bg-light-l",
              )}
            />
          )}
          {__hovered && showBG && (
            <m.span
              key="background"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              exit={{ clipPath: "inset(0 100% 0 0)" }}
              transition={{ ease: "backOut" }}
              className={cn(
                "absolute left-0 md:left-1 right-0 md:right-1 bottom-(--underline-height) top-0",
                theme === "light" ? "bg-light-l" : "bg-dark-d",
              )}
            />
          )}
        </AnimatePresence>
        <TextRoll hovered={__hovered}>{children}</TextRoll>
      </m.a>
    );
  },
);

export default Link;
