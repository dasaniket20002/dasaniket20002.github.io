import { IconArrowDown, IconArrowRight } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Button from "../../components/button";
import SVGText from "../../components/svg-text";
import QuarterSparkSVG from "../../components/svg/quarter-spark-svg";
import type { RefObject } from "react";

export function BottomSection({
  revealContent,
  containerRef,
}: {
  revealContent: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.div layout className="relative flex flex-col gap-2 m-0">
      <AnimatePresence mode="popLayout">
        {revealContent && (
          <motion.section
            layout
            drag={revealContent}
            dragConstraints={containerRef}
            whileDrag={{ scale: 1.1 }}
            className="absolute origin-bottom-right -translate-x-1/2 -translate-y-1/2 -top-1 left-1 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, ease: "backOut" }}
            data-screen-shakable={true}
          >
            <QuarterSparkSVG className="stroke-dark-1 stroke-6 size-[clamp(1rem,4vw,3rem)]" />
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
        {["D", "E", "V", "E", "LO", "P", "E", "R"].map((c, i) => (
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
            className="font-think-loved trim-text-caps text-[clamp(3rem,18cqw,14rem)] stroke-light-1 stroke-16 fill-dark-1 z-2 cursor-grab"
            data-screen-shakable={true}
          >
            {c}
          </SVGText>
        ))}
      </motion.section>
      <AnimatePresence mode="wait">
        {revealContent && (
          <motion.div
            layout
            className="w-full flex justify-between items-center gap-8"
            initial={{ clipPath: "inset(0 50% 0 50%)" }}
            animate={{ clipPath: "inset(0 0% 0 0%)" }}
            transition={{ delay: 0.9, ease: "easeInOut" }}
          >
            <Button
              variant="light"
              text="Know More"
              icon={
                <IconArrowDown className="stroke-2 [stroke-linecap:round]" />
              }
            />
            <span className="h-px bg-dark-1 flex-1" />
            <Button
              variant="dark"
              text="Let's Connect"
              icon={
                <IconArrowRight className="stroke-2 [stroke-linecap:round]" />
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
