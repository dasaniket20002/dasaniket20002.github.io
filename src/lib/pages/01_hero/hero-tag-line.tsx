import { motion } from "motion/react";
import { cn } from "../../utils";

export default function HeroTagLine({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        "place-content-center size-full pl-4 md:pl-16 uppercase tracking-tight font-light text-[max(1.618rem,1.618vw)] text-dark-1 flex flex-col -space-y-3",
        className,
      )}
      initial={{ clipPath: "inset(0 100% 0 0)", scale: 1.25, opacity: 0.75 }}
      animate={{ clipPath: "inset(0 0% 0 0)", scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <p className="pb-2">I bridge the gap between</p>
      <p className="italic font-normal text-[max(2.427rem,2.427vw)] tracking-normal text-dark-1">
        technical architecture
      </p>
      <p>
        and{" "}
        <span className="italic font-normal text-[max(2.427rem,2.427vw)] tracking-normal text-dark-1">
          visual storytelling.
        </span>
      </p>
    </motion.div>
  );
}
