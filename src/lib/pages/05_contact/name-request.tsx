import { useState } from "react";
import { cn } from "../../utils";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

export default function NameRequest({
  className,
  inputValue,
  setInputValue,
}: {
  className?: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  return (
    <span
      className={cn(
        "relative inline-block transition-colors duration-1000 rounded-md mx-[0.5ch]",
        focused && "bg-dark-l/10",
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        {!inputValue && (
          <m.span
            initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 0% 100%)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 place-content-center font-width-90 font-bold px-[0.5ch] text-dark-l/75 pointer-events-none"
          >
            Your Name
          </m.span>
        )}
      </AnimatePresence>
      <input
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setInputValue(e.target.value)}
        id="form-name"
        type="text"
        className="outline-none font-width-90 font-bold px-[0.5ch]"
      />
      <span className="absolute bottom-4 left-0 right-0 h-px bg-dark-l/75" />
      <m.span
        initial={{ right: "100%" }}
        animate={{ right: hovered ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "anticipate" }}
        className="absolute bottom-4 left-0 h-px bg-light-d/75"
      />
      <m.span
        initial={{ right: "100%" }}
        animate={{ right: focused ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "anticipate" }}
        className="absolute bottom-4 left-0 h-px bg-light-d"
      />
    </span>
  );
}
