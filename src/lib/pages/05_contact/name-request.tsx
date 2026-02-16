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
        focused && "bg-light-2/25",
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
            className="absolute inset-0 place-content-center font-width-90 font-bold px-[0.5ch] text-light-2/75 pointer-events-none"
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
        className="outline-none font-width-90 font-bold px-[0.5ch] placeholder:text-light-2/75"
      />
      <span className="absolute bottom-4 left-0 right-0 h-px bg-dark-1/75" />
      <m.span
        initial={{ right: "100%" }}
        animate={{ right: hovered ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "anticipate" }}
        className="absolute bottom-4 left-0 h-px bg-light-2/75"
      />
      <m.span
        initial={{ right: "100%" }}
        animate={{ right: focused ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "anticipate" }}
        className="absolute bottom-4 left-0 h-px bg-light-2"
      />
    </span>
  );
}
