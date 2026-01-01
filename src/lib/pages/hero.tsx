import { IconArrowDown, IconArrowRight } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Button from "../components/button";
import QuarterSpark from "../components/quarter-spark";
import { ScrollVelocity } from "../components/scroll-velocity";
import SVGText from "../components/svg-text";
import { cn } from "../utils";

export default function Hero({ className }: { className?: string }) {
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const [revealContent, setRevealContent] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setRevealContent(true);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={dragConstraintsRef}
      data-bg-theme="light"
      className={cn(
        "h-page w-full text-dark-1 -space-y-4 relative",
        "bg-light-1 place-content-center place-items-center",
        className
      )}
    >
      <motion.div layout className="relative flex flex-col">
        <AnimatePresence mode="wait">
          {revealContent && (
            <motion.section
              layout
              className="w-full uppercase font-extralight text-4xl flex items-center justify-between px-4"
              initial={{ clipPath: "inset(0 50% 0 50%)" }}
              animate={{ clipPath: "inset(0 0% 0 0%)" }}
              transition={{ delay: 0.5, ease: "easeInOut" }}
            >
              <p>HI, I'M ANIKET DAS -</p>
              <p>A</p>
            </motion.section>
          )}
        </AnimatePresence>
        <motion.section
          layout
          className="relative -space-x-2 flex select-none cursor-pointer"
          initial={{ scale: 1.2, opacity: 0.3 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ease: "backOut" }}
        >
          {["C", "RE", "A", "T", "I", "V", "E"].map((c, i) => (
            <SVGText
              key={i}
              drag={revealContent}
              dragConstraints={dragConstraintsRef}
              whileDrag={{ scale: 1.1 }}
              className="font-think-loved trim-text-caps text-[clamp(4rem,23cqw,16rem)] stroke-light-1 stroke-16 fill-dark-1 z-2"
            >
              {c}
            </SVGText>
          ))}
        </motion.section>
      </motion.div>

      <AnimatePresence mode="wait">
        {revealContent && (
          <motion.div
            layout
            className="w-full px-4 grid grid-cols-[1fr_20rem_1fr]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <section className="text-end self-center uppercase tracking-wide leading-8 font-extralight text-[clamp(1rem,2.5vw,2rem)] whitespace-nowrap flex flex-col">
              <motion.p
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
              >
                LET'S BUILD YOUR FIRST
              </motion.p>
              <motion.p
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 0.8, delay: 0.75, ease: "easeInOut" }}
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
              <img
                src="assets/portrait/Portrait-BG.png"
                alt="Portrait-BG"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              <motion.section
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.75, ease: "anticipate" }}
                className="absolute size-[50%] md:size-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 md:border-[0.25vw] border-amber-400 outline-16 md:outline-[0.5vw] outline-amber-400 outline-offset-4"
              />
              <img
                src="assets/portrait/Portrait-FG.png"
                alt="Portrait-FG"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </motion.div>
            <section className="text-start self-center uppercase tracking-wide leading-10 font-extralight text-[clamp(1rem,2.5vw,2rem)] whitespace-nowrap">
              <motion.p
                initial={{ clipPath: "inset(0 0 0 100%)" }}
                animate={{ clipPath: "inset(0 0 0 0%)" }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeInOut" }}
              >
                \ WEB DESIGN (UI/UX)
              </motion.p>
              <motion.p
                initial={{ clipPath: "inset(0 0 0 100%)" }}
                animate={{ clipPath: "inset(0 0 0 0%)" }}
                transition={{ duration: 0.8, delay: 0.75, ease: "easeInOut" }}
              >
                \ WEB DEVELOPER
              </motion.p>
              <motion.p
                initial={{ clipPath: "inset(0 0 0 100%)" }}
                animate={{ clipPath: "inset(0 0 0 0%)" }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
              >
                \ CREATIVE DESIGN
              </motion.p>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="relative flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {revealContent && (
            <motion.section
              layout
              className="absolute origin-bottom-right -translate-x-1/2 -translate-y-1/2 -top-1 left-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, ease: "backOut" }}
            >
              <QuarterSpark className="stroke-dark-1 stroke-6 size-[clamp(1rem,4vw,3rem)]" />
            </motion.section>
          )}
        </AnimatePresence>
        <motion.section
          layout
          className="relative -space-x-2 flex select-none cursor-pointer"
          initial={{ scale: 1.2, opacity: 0.3 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ease: "backOut" }}
        >
          {["D", "E", "V", "E", "LO", "P", "E", "R"].map((c, i) => (
            <SVGText
              key={i}
              drag={revealContent}
              dragConstraints={dragConstraintsRef}
              whileDrag={{ scale: 1.1 }}
              dragElastic={0.1}
              className="font-think-loved trim-text-caps text-[clamp(3rem,18cqw,14rem)] stroke-light-1 stroke-16 fill-dark-1 z-2"
            >
              {c}
            </SVGText>
          ))}
        </motion.section>
        <AnimatePresence mode="wait">
          {revealContent && (
            <motion.div
              layout
              className="w-full flex justify-between items-center"
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

      {revealContent && (
        <motion.div
          layout
          className="absolute bottom-0 w-full"
          initial={{ opacity: 0, clipPath: "inset(0 50% 0 50%)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0%)" }}
          transition={{ delay: 1.1, ease: "easeInOut" }}
        >
          <ScrollVelocity
            texts={[
              <span className="px-6 py-2 space-x-12">
                <span className="tracking-wide">
                  Available for collaboration at&nbsp;
                  <a href="#" className="font-normal">
                    dasaniket20002@gmail.com
                  </a>
                </span>
                <span>\</span>
              </span>,
              <span className="px-6 py-2 space-x-12">
                <span className="tracking-wide">Scroll Down</span>
                <span>\</span>
              </span>,
            ]}
            velocity={60}
            numCopies={12}
            className="text-sm font-helvetica font-light text-dark-1"
          />
        </motion.div>
      )}
    </div>
  );
}
