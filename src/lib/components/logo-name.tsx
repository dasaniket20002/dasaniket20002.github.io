import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { useState } from "react";
import { cn } from "../utils";

const letterVariants = {
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
  exit: {
    opacity: 0.5,
    scale: 0,
    width: 0,
  },
};

const containerVariants = {
  hidden: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export default function LogoName({
  className,
  ...motionProps
}: {
  className?: string;
} & HTMLMotionProps<"section">) {
  const [hovered, setHovered] = useState(false);

  const name1 = "niket".split("");
  const name2 = "as".split("");

  return (
    <motion.section
      {...motionProps}
      className={cn(
        "flex items-center gap-[0.25em] p-[0.5em] text-2xl font-think-loved select-none text-dark-1",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* --- First Name Part --- */}
      <div className="flex">
        <span className="-mx-[0.025em] trim-text-caps">A</span>

        <AnimatePresence mode="wait">
          {hovered && (
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex"
            >
              {name1.map((char, i) => (
                <motion.span
                  layout
                  key={i}
                  variants={letterVariants}
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
      <AnimatePresence initial={false} mode="wait">
        {!hovered && (
          <motion.span
            layout
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "2ch", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-[0.15em] bg-current"
          />
        )}
      </AnimatePresence>

      {/* --- Last Name Part --- */}
      <div className="flex">
        <span className="-mx-[0.025em] trim-text-caps">D</span>

        <AnimatePresence mode="wait">
          {hovered && (
            <motion.section
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex"
            >
              {name2.map((char, i) => (
                <motion.span
                  layout
                  key={i}
                  variants={letterVariants}
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
}
