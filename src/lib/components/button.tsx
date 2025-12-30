import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { useState } from "react";
import { cn } from "../utils";
import TextRoll from "./text-roll";

export default function Button({
  text,
  className,
  onClick,
  icon,
  variant = "dark",
  ...motionProps
}: {
  text?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  variant?: "light" | "dark";
} & HTMLMotionProps<"button">) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      {...motionProps}
      onClick={onClick}
      className={cn(
        "group/button min-w-42 max-w-96 h-12",
        "flex gap-2 items-center justify-center shadow",
        variant === "dark" &&
          "bg-dark-1 text-light-2 border-3 border-dark-1 hover:bg-transparent hover:text-dark-1",
        variant === "light" && "bg-light-1 text-dark-1 border-3 border-dark-1",
        "cursor-pointer [&>svg]:size-4 transition-colors duration-150",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence mode="popLayout">
        <TextRoll key="text" hovered={hovered} layout>
          {text}
        </TextRoll>
        {icon && hovered && (
          <motion.section
            key="icon"
            initial={{ width: 0, opacity: 0, scale: 0 }}
            animate={{ width: "auto", opacity: 1, scale: 1 }}
            exit={{ width: 0, opacity: 0, scale: 0 }}
            transition={{ ease: "backOut" }}
          >
            {icon}
          </motion.section>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
