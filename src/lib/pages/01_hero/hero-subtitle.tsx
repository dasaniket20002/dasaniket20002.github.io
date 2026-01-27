import { motion } from "motion/react";
import { cn } from "../../utils";

export default function HeroSubtitle({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        "grid grid-cols-subgrid items-center text-[max(1.618rem,1.618vw)] font-thin uppercase",
        className,
      )}
      initial={{ clipPath: "inset(0 50% 0 50%)", scale: 1.25, opacity: 0.75 }}
      animate={{ clipPath: "inset(0 0% 0 0%)", scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.75, ease: "easeOut" }}
      data-screen-shakable={true}
      data-return-to-origin={true}
    >
      <h3 className="col-[1/4] pr-6 text-end">
        Hi, I'm <span className="font-light">Aniket Das</span>
      </h3>
      <h3 className="col-[5/6] pl-6">A</h3>
    </motion.div>
  );
}
