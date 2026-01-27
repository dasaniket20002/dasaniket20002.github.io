import { motion } from "motion/react";
import { cn } from "../../utils";

export default function HeroTagLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "place-content-center size-full pl-4 md:pl-16 uppercase tracking-tight font-light text-[max(1.618rem,1.618vw)] text-dark-1 flex flex-col -space-y-3",
        className,
      )}
    >
      <motion.p
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="pb-2"
      >
        I bridge the gap between
      </motion.p>
      <motion.p
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="italic font-normal text-[max(2.427rem,2.427vw)] tracking-normal text-dark-1"
      >
        technical architecture
      </motion.p>
      <motion.p
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        and{" "}
        <span className="italic font-normal text-[max(2.427rem,2.427vw)] tracking-normal text-dark-1">
          visual storytelling.
        </span>
      </motion.p>
    </div>
  );
}
