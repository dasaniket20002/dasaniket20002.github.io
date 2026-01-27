import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useState } from "react";
import { cn } from "../utils";
import TextRoll from "./text-roll";

type ButtonProps = {
  text?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  variant?: "light" | "dark";
} & HTMLMotionProps<"button">;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { text, className, onClick, icon, variant = "dark", ...motionProps },
    ref,
  ) => {
    const [hovered, setHovered] = useState(false);

    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        className={cn(
          "group/button min-w-42 max-w-96 h-12",
          "flex gap-2 items-center justify-center shadow-2xl",
          variant === "dark" &&
            "bg-dark-1 text-light-2 border-3 border-dark-1 hover:bg-transparent hover:text-dark-1",
          variant === "light" &&
            "bg-light-1 text-dark-1 border-3 border-dark-1",
          "cursor-pointer [&>svg]:size-4 transition-colors duration-150",
          className,
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.8 }}
        {...motionProps}
      >
        <TextRoll key="text" hovered={hovered} layout>
          {text}
        </TextRoll>
        <AnimatePresence mode="popLayout">
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
  },
);

export default Button;
