import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { useState } from "react";
import { cn } from "../utils";
import TextRoll from "./text-roll";

export default function Button({
  text,
  className,
  onClick,
  icon,
  ...motionProps
}: {
  text?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
} & HTMLMotionProps<"button">) {
  const [hovered, setHovered] = useState(false);
  const _motionProps: HTMLMotionProps<"button"> = {
    ...motionProps,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.button
        {..._motionProps}
        onClick={onClick}
        className={cn(
          "group/button min-w-42 max-w-96 h-12 bg-dark-1 text-light-2",
          "flex gap-2 items-center justify-center shadow",
          "cursor-pointer [&>svg]:size-4",
          className
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <TextRoll hovered={hovered} layout>
          {text}
        </TextRoll>
        {icon && hovered && (
          <motion.section
            layout
            initial={{ width: 0, opacity: 0, scaleX: 0 }}
            animate={{ width: "auto", opacity: 1, scaleX: 1 }}
            exit={{ width: 0, opacity: 0, scaleX: 0 }}
            className="origin-left"
          >
            {icon}
          </motion.section>
        )}
      </motion.button>
    </AnimatePresence>
  );
}
