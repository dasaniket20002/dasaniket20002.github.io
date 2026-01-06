import { motion } from "motion/react";
import TextRoll from "../../components/text-roll";
import { ShakeButton } from "./shake-button";
import type { ShakeOptions } from "../../hooks/use-screen-shake";

export function MiddleSection({
  shake,
}: {
  shake: (p?: ShakeOptions) => void;
}) {
  return (
    <motion.div
      layout
      className="relative w-full px-4 grid grid-cols-[1fr_20rem_1fr]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.9, ease: "backOut" }}
    >
      <ShakeButton shake={shake} />

      <section className="text-end self-center uppercase tracking-wide leading-8 font-light text-[clamp(1rem,2.5vw,2rem)] whitespace-nowrap flex flex-col">
        <motion.p
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
        >
          LET'S BUILD YOUR
        </motion.p>
        <motion.p
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.8, delay: 0.75, ease: "easeInOut" }}
          className="italic font-normal"
        >
          BUSINESS WEBSITE
        </motion.p>
        <motion.p
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
        >
          TOGETHER
        </motion.p>
      </section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease: "anticipate" }}
        className="relative aspect-3/4 w-[150vw] md:w-56 place-self-center"
      >
        <motion.img
          src="assets/portrait/Portrait-BG.png"
          alt="Portrait-BG"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.8, delay: 0.6, ease: "anticipate" }}
        />
        <motion.section
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75, ease: "anticipate" }}
          className="absolute size-[50%] md:size-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 md:border-[0.25vw] border-amber-400 outline-16 md:outline-[0.5vw] outline-amber-400 outline-offset-4"
        />
        <motion.img
          src="assets/portrait/Portrait-FG.png"
          alt="Portrait-FG"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.8, delay: 0.6, ease: "anticipate" }}
        />
      </motion.div>
      <section className="text-start self-center uppercase tracking-wide leading-10 space-y-3 font-light text-[clamp(1rem,2.5vw,2rem)] whitespace-nowrap">
        <motion.p
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
        >
          <TextRoll className="w-min px-2 py-1">
            \&nbsp;WEB&nbsp;DESIGN&nbsp;(UI/UX)
          </TextRoll>
        </motion.p>
        <motion.p
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          transition={{ duration: 0.8, delay: 0.75, ease: "easeInOut" }}
        >
          <TextRoll className="w-min px-2 py-1">
            \&nbsp;WEB&nbsp;DEVELOPER
          </TextRoll>
        </motion.p>
        <motion.p
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
        >
          <TextRoll className="w-min px-2 py-1">
            \&nbsp;CREATIVE&nbsp;DESIGN
          </TextRoll>
        </motion.p>
      </section>
    </motion.div>
  );
}
