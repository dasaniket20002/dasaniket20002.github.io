import {
  motion,
  useAnimationControls,
  type HTMLMotionProps,
} from "motion/react";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import { cn } from "../utils";

type TextRollProps = {
  children?: string;
  className?: string;
  hovered?: boolean;
} & HTMLMotionProps<"span">;

const TextRoll = forwardRef<HTMLSpanElement, TextRollProps>(
  ({ children, className, hovered, ...motionProps }, ref) => {
    const isAnimating = useRef(false);
    const controls = useAnimationControls();
    const characters = children?.split("") || [];

    const handleHover = useCallback(async () => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      await controls.start((i) => ({
        y: "-100%",
        transition: { delay: i / 100, ease: "backOut" },
      }));
      controls.set({ y: "0%" });

      isAnimating.current = false;
    }, [controls]);

    useEffect(() => {
      if (hovered === undefined) return;
      handleHover();
    }, [hovered, handleHover]);

    return (
      <motion.span
        ref={ref}
        onMouseEnter={() => {
          if (hovered === undefined) handleHover();
        }}
        onMouseLeave={() => {
          if (hovered === undefined) handleHover();
        }}
        className={cn(
          "relative flex flex-col h-[calc(1em+1px)] overflow-hidden select-none",
          className,
        )}
        {...motionProps}
      >
        {/* Row 1: The Original Text */}
        <span className="flex h-[calc(1em+1px)] leading-[calc(1em+1px)]">
          {characters.map((char, i) => (
            <motion.span
              key={`char1-${i}`}
              custom={i}
              animate={controls}
              initial={{ y: "0%" }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </span>

        {/* Row 2: The Coming-from-bottom Text */}
        <span className="flex h-[calc(1em+1px)] leading-[calc(1em+1px)]">
          {characters.map((char, i) => (
            <motion.span
              key={`char2-${i}`}
              custom={i}
              animate={controls}
              initial={{ y: "0%" }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </span>
      </motion.span>
    );
  },
);

export default TextRoll;
