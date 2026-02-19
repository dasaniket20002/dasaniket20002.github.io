import {
  AnimatePresence,
  useDragControls,
  type HTMLMotionProps,
} from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useState } from "react";
import { cn } from "../utils";
import TextRoll from "./text-roll";

type ButtonProps = {
  text?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  variant?: "light" | "dark";
  magnetic?: boolean;
} & HTMLMotionProps<"button">;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      text,
      className,
      onClick,
      icon,
      variant = "light",
      magnetic = false,
      disabled,
      ...motionProps
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState(false);
    const dragControls = useDragControls();

    return (
      <m.button
        ref={ref}
        onClick={onClick}
        className={cn(
          "group/button min-w-42 max-w-96 h-12 rounded-sm pt-1",
          "flex gap-2 items-center justify-center shadow-2xl",
          variant === "dark" &&
            "bg-dark-d text-light-l border border-dark-l hover:bg-transparent hover:border-light-d",
          variant === "light" && "bg-light-l text-dark-d border border-dark-l",
          "cursor-pointer disabled:cursor-not-allowed transition-colors duration-150",
          className,
        )}
        onMouseEnter={(e) => {
          setHovered(true);
          dragControls.start(e as unknown as PointerEvent);
        }}
        onMouseLeave={() => {
          setHovered(false);
          dragControls.stop();
        }}
        initial={{ scale: 1 }}
        whileTap={{ scale: disabled ? 1 : 0.8 }}
        drag={magnetic}
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.2}
        dragListener={false}
        dragControls={dragControls}
        disabled={disabled}
        {...motionProps}
      >
        <TextRoll key="text" hovered={hovered && !disabled} layout>
          {text}
        </TextRoll>
        <AnimatePresence mode="popLayout">
          {icon && hovered && !disabled && (
            <m.section
              key="icon"
              initial={{ width: 0, opacity: 0, scale: 0 }}
              animate={{ width: "auto", opacity: 1, scale: 1 }}
              exit={{ width: 0, opacity: 0, scale: 0 }}
              transition={{ ease: "backOut" }}
            >
              {icon}
            </m.section>
          )}
        </AnimatePresence>
      </m.button>
    );
  },
);

export default Button;
