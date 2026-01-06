import { AnimatePresence, motion } from "motion/react";
import type { RefObject } from "react";
import SVGText from "../../components/svg-text";

export function TopSection({
  revealContent,
  containerRef,
}: {
  revealContent: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.div layout className="relative flex flex-col">
      <AnimatePresence mode="wait">
        {revealContent && (
          <motion.section
            layout
            className="w-full uppercase font-light text-4xl flex items-center justify-between gap-8 px-4"
            initial={{ clipPath: "inset(0 50% 0 50%)" }}
            animate={{ clipPath: "inset(0 0% 0 0%)" }}
            transition={{ delay: 0.5, ease: "easeInOut" }}
          >
            <p className="flex-none">HI, I'M ANIKET DAS</p>
            <span className="bg-current h-px flex-1" />
            <p className="flex-none">A</p>
          </motion.section>
        )}
      </AnimatePresence>
      <motion.section
        layout
        className="relative -space-x-2 flex select-none"
        initial={{ scale: 1.2, opacity: 0.3 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ease: "backOut" }}
      >
        {["C", "RE", "A", "T", "I", "V", "E"].map((c, i) => (
          <SVGText
            key={i}
            drag={revealContent}
            dragConstraints={containerRef}
            dragElastic={0.1}
            initial={{
              scale: 1,
              filter: "drop-shadow(0px 0px 0px oklch(0 0 0 / 0))",
              zIndex: 2,
            }}
            whileDrag={{
              scale: 1.1,
              filter:
                "drop-shadow(0px 0px 7px color-mix(in oklch, var(--color-dark-1) 50%, transparent))",
              zIndex: 9998,
              cursor: "grabbing",
            }}
            transition={{ filter: { ease: "easeOut" } }}
            className="font-think-loved trim-text-caps text-[clamp(4rem,23cqw,16rem)] stroke-light-1 stroke-16 fill-dark-1 cursor-grab"
            data-screen-shakable={true}
          >
            {c}
          </SVGText>
        ))}
      </motion.section>
    </motion.div>
  );
}
