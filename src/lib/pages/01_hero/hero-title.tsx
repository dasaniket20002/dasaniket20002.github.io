import { motion } from "motion/react";
import SVGText from "../../components/svg-text";
import { cn } from "../../utils";

export default function HeroTitle({
  className,
  containerRef,
}: {
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <motion.div
      className={cn(
        "self-end relative size-full flex flex-col gap-2 items-center justify-end",
        className,
      )}
      initial={{ scale: 1.25, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.75, ease: "anticipate" }}
    >
      <section className="relative flex select-none">
        {["C", "RE", "A", "T", "I", "V", "E"].map((c, i) => (
          <SVGText
            key={i}
            drag
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
              zIndex: 98,
              cursor: "grabbing",
            }}
            transition={{ filter: { ease: "easeOut" } }}
            className="font-think-loved trim-text-caps text-[max(8.09rem,8.09vw)] stroke-light-1 stroke-16 fill-dark-1 cursor-grab"
            data-screen-shakable={true}
          >
            {c}
          </SVGText>
        ))}
      </section>
      <section className="relative flex select-none">
        {["D", "E", "V", "E", "LO", "P", "E", "R"].map((c, i) => (
          <SVGText
            key={i}
            drag
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
              zIndex: 98,
              cursor: "grabbing",
            }}
            transition={{ filter: { ease: "easeOut" } }}
            className="font-think-loved trim-text-caps text-[max(9.708rem,9.708vw)] stroke-light-1 stroke-16 fill-dark-1 z-2 cursor-grab"
            data-screen-shakable={true}
          >
            {c}
          </SVGText>
        ))}
      </section>
    </motion.div>
  );
}
