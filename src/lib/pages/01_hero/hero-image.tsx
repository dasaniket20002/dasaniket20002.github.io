import { motion } from "motion/react";
import { cn } from "../../utils";

export default function HeroImage({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative aspect-3/4 w-full", className)}
      data-screen-shakable={true}
      data-return-to-origin={true}
    >
      <motion.img
        src="assets/portrait/Portrait-BG.png"
        alt="Portrait-BG"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        // initial={{ scale: 0 }}
        // animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "anticipate" }}
      />
      <motion.section
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.75, ease: "anticipate" }}
        className="absolute size-[50%] md:size-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu border-8 md:border-[0.25vw] border-amber-400 outline-16 md:outline-[0.5vw] outline-amber-400 outline-offset-4"
      />
      <motion.img
        src="assets/portrait/Portrait-FG.png"
        alt="Portrait-FG"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1, delay: 0.25, ease: "anticipate" }}
      />
    </div>
  );
}
