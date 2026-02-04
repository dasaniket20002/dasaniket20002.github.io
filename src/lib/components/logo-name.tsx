import {
  AnimatePresence,
  motion,
  stagger,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import { forwardRef, useState } from "react";
import { cn } from "../utils";

const LETTER_VARIANTS: Variants = {
  hidden: {
    opacity: 0.5,
    scale: 0,
    width: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    width: "auto",
  },
};

const CONTAINER_VARIANTS: Variants = {
  hidden: {
    transition: { delayChildren: stagger(0.025, { from: -1 }) },
  },
  visible: {
    transition: { delayChildren: stagger(0.025) },
  },
};

const NAME_1 = "Aniket";
const NAME_2 = "Das";

const NAME_1_SPLIT = NAME_1.split("").filter((_, i) => i !== 0);
const NAME_2_SPLIT = NAME_2.split("").filter((_, i) => i !== 0);

type LogoNameProps = {
  className?: string;
} & HTMLMotionProps<"section">;

const LogoName = forwardRef<HTMLElement, LogoNameProps>(
  ({ className, ...motionProps }, ref) => {
    const [hovered, setHovered] = useState(false);

    return (
      <motion.section
        ref={ref}
        className={cn(
          "flex items-center text-2xl font-think-loved select-none text-dark-1 transition-[gap]",
          hovered ? "gap-4" : "gap-[0.25em]",
          className,
        )}
        layout
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...motionProps}
      >
        {/* --- First Name Part --- */}
        <div className="flex">
          <span className="-mx-[0.025em] trim-text-caps">
            {NAME_1.charAt(0)}
          </span>

          <AnimatePresence mode="wait">
            {hovered && (
              <motion.section
                variants={CONTAINER_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex"
              >
                {NAME_1_SPLIT.map((char, i) => (
                  <motion.span
                    layout
                    key={i}
                    variants={LETTER_VARIANTS}
                    transition={{ ease: "backOut" }}
                    className="origin-bottom-left! -mx-[0.025em] trim-text-caps h-min"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* --- Dash --- */}
        <motion.span
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: hovered ? "0ch" : "2ch", opacity: hovered ? 0 : 1 }}
          className="h-[0.15em] bg-current"
        />

        {/* --- Last Name Part --- */}
        <div className="flex">
          <span className="-mx-[0.025em] trim-text-caps">
            {NAME_2.charAt(0)}
          </span>

          <AnimatePresence mode="wait">
            {hovered && (
              <motion.section
                variants={CONTAINER_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex"
              >
                {NAME_2_SPLIT.map((char, i) => (
                  <motion.span
                    layout
                    key={i}
                    variants={LETTER_VARIANTS}
                    transition={{ ease: "easeOut" }}
                    className="origin-bottom-left! -mx-[0.025em] trim-text-caps h-min"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    );
  },
);

export default LogoName;
