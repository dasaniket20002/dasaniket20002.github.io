import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/use-click-outside";
import { AnimatePresence } from "motion/react";
import { cn } from "../../utils";
import { IconChevronDown } from "@tabler/icons-react";
import * as m from "motion/react-m";

const SERVICE_REQUEST_OPTIONS = [
  "UI/UX Design",
  "Web Design",
  "Development",
  "Creative Design",
  "Other",
];
const PLACEHOLDER_CHANGE_TIMER = 5000;

const DropdownOption = memo(function DropdownOption({
  option,
  index,
  totalCount,
  onSelect,
}: {
  option: string;
  index: number;
  totalCount: number;
  onSelect: (option: string) => void;
}) {
  return (
    <m.button
      layout
      type="button"
      initial={{ opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }}
      animate={{
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        transition: { delay: 0.1 * index },
      }}
      exit={{
        opacity: 0,
        clipPath: "inset(0% 0% 0% 100%)",
        transition: {
          delay: 0.025 * (totalCount - index - 1),
        },
      }}
      onClick={() => onSelect(option)}
      className={cn(
        "relative w-full text-start bg-light-1 cursor-pointer px-[0.5ch] py-3 shadow-2xl",
        "before:absolute before:inset-1 before:rounded-md before:transition-colors before:duration-250 hover:before:bg-light-2/25 before:-z-1",
        index === 0 && "rounded-t-md",
        index === totalCount - 1 && "rounded-b-md",
      )}
    >
      {option}
    </m.button>
  );
});

export default function ServiceRequest({ className }: { className?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [placeholderValueIndex, setPlaceholderValueIndex] = useState(0);
  const [filteredElements, setFilteredElements] = useState<string[]>(
    SERVICE_REQUEST_OPTIONS,
  );

  const filterElements = useCallback((input: string) => {
    const _filteredElements = SERVICE_REQUEST_OPTIONS.filter((req_opt) => {
      if (req_opt === "Other" || !input) return true;
      return req_opt.toLowerCase().includes(input.toLowerCase());
    });
    setFilteredElements(_filteredElements);
  }, []);

  useEffect(() => {
    if (!inputValue) {
      const interval = setInterval(
        () =>
          setPlaceholderValueIndex(
            (val) => (val + 1) % (SERVICE_REQUEST_OPTIONS.length - 1),
          ),
        PLACEHOLDER_CHANGE_TIMER,
      );
      return () => clearInterval(interval);
    }
  }, [inputValue]);

  const handleClickOutside = useCallback(() => setFocused(false), []);
  useClickOutside(containerRef, handleClickOutside);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  const handleInputClick = useCallback(() => {
    setFocused(true);
    filterElements("");
  }, [filterElements]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      filterElements(e.target.value);
    },
    [filterElements],
  );

  const handleOptionSelect = useCallback((option: string) => {
    setInputValue(option);
    setFocused(false);
  }, []);

  return (
    <span
      ref={containerRef}
      className={cn(
        "relative inline-block transition-colors duration-1000 rounded-md mx-[0.5ch]",
        focused && "bg-light-2/25",
        className,
      )}
    >
      {!inputValue && (
        <span className="absolute inset-0 pointer-events-none">
          <AnimatePresence mode="popLayout">
            <m.span
              key={placeholderValueIndex}
              initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ clipPath: "inset(0% 0% 0% 100%)" }}
              transition={{ duration: 1 }}
              className="absolute inset-0 px-[0.5ch] font-width-90 font-bold text-light-2/75 place-content-center"
            >
              {SERVICE_REQUEST_OPTIONS[placeholderValueIndex]}
            </m.span>
          </AnimatePresence>
        </span>
      )}
      <input
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleInputClick}
        value={inputValue}
        onChange={handleInputChange}
        id="form-service-request"
        type="text"
        className="outline-none font-width-90 font-bold px-[0.5ch] placeholder:text-light-2/75 [anchor-name:--service-request-select]"
      />
      <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
        <IconChevronDown
          className={cn(
            "size-8 stroke-light-2 transition",
            focused && "-rotate-90 stroke-dark-1",
          )}
        />
      </span>
      <span className="absolute bottom-4 left-0 right-0 h-px bg-light-2" />
      <m.span
        initial={{ right: "100%" }}
        animate={{ right: hovered ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute bottom-4 left-0 h-px bg-dark-1/25"
      />
      <m.span
        initial={{ right: "100%" }}
        animate={{ right: focused ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "anticipate" }}
        className="absolute bottom-4 left-0 h-px bg-dark-1"
      />

      <m.div
        initial={{ height: "0rem", opacity: 0 }}
        animate={{
          height: focused ? "auto" : "0rem",
          opacity: focused ? 1 : 0.25,
          transition: { delay: focused ? 0 : 0.25, type: "spring" },
        }}
        className={cn(
          "w-full absolute z-10 rounded-md mt-1.5 transition-colors duration-1000",
          "[position-anchor:--service-request-select] top-[anchor(bottom)] [justify-self:anchor-center]",
          "[position-try:flip-block_flip-inline] [position-visibility:anchors-visible]",
        )}
      >
        <AnimatePresence mode="popLayout">
          {focused &&
            filteredElements.map((req_opt, i) => (
              <DropdownOption
                key={req_opt}
                option={req_opt}
                index={i}
                totalCount={filteredElements.length}
                onSelect={handleOptionSelect}
              />
            ))}
        </AnimatePresence>
      </m.div>
    </span>
  );
}
