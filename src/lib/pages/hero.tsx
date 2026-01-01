import { IconArrowDown, IconArrowRight } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Button from "../components/button";
import QuarterSpark from "../components/quarter-spark";
import { ScrollVelocity } from "../components/scroll-velocity";
import SVGText from "../components/svg-text";
import { useScreenShake } from "../hooks/use-screen-shake";
import { cn } from "../utils";

export default function Hero({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { controls: screenShakeControls, shake } = useScreenShake(containerRef);

  const [revealContent, setRevealContent] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setRevealContent(true);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      data-bg-theme="light"
      className={cn(
        "h-page w-full text-dark-1 -space-y-4 relative",
        "bg-light-1 place-content-center place-items-center",
        className
      )}
      animate={screenShakeControls}
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
              }}
              transition={{ filter: { ease: "easeOut" } }}
              className="font-think-loved trim-text-caps text-[clamp(4rem,23cqw,16rem)] stroke-light-1 stroke-16 fill-dark-1"
              data-screen-shakable={true}
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
            className="relative w-full px-4 grid grid-cols-[1fr_20rem_1fr]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: "backOut" }}
          >
            <motion.button
              className="absolute top-0 left-1/2 -translate-x-1/2 z-3 cursor-pointer"
              initial={{ scale: 1.8, rotate: "0deg", opacity: 0 }}
              animate={{ scale: 1, rotate: ["0deg", "360deg"], opacity: 1 }}
              whileHover={{
                scale: [1, 1.5, 1.2],
                rotate: "0deg",
                transition: { scale: { duration: 0.4 } },
              }}
              whileTap={{
                scale: [1, 0.5, 1],
                rotate: "0deg",
                transition: { scale: { duration: 0.2 } },
              }}
              transition={{
                default: { ease: "backOut", duration: 0.4, delay: 2.5 },
                rotate: {
                  repeat: Infinity,
                  repeatDelay: 2,
                  repeatType: "loop",
                  duration: 0.8,
                  ease: "backOut",
                  delay: 4.5,
                },
              }}
              onClick={() => shake()}
            >
              <motion.section className="size-6">
                <svg
                  width="35"
                  height="33"
                  viewBox="0 0 35 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-full stroke-dark-1 stroke-2"
                >
                  <path
                    d="M17.5001 1.5L20.0404 10.2958C20.3503 11.3691 20.5054 11.9057 20.8114 12.3444C21.0822 12.7326 21.4374 13.0635 21.8542 13.3159C22.325 13.601 22.901 13.7454 24.0531 14.0342L33.4941 16.4008L24.0522 18.7709C22.9 19.0601 22.3239 19.2048 21.853 19.49C21.4361 19.7425 21.0807 20.0736 20.8098 20.4619C20.5036 20.9007 20.3483 21.4374 20.0379 22.5109L17.494 31.3075L14.9537 22.5118C14.6438 21.4384 14.4887 20.9018 14.1827 20.4632C13.9118 20.0749 13.5566 19.7439 13.14 19.4916C12.6691 19.2066 12.0931 19.0621 10.941 18.7733L1.49999 16.4067L10.9419 14.0366C12.0941 13.7474 12.6702 13.6027 13.1412 13.3175C13.558 13.065 13.9133 12.7339 14.1843 12.3457C14.4905 11.9068 14.6458 11.3701 14.9562 10.2967L17.5001 1.5Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.section>
            </motion.button>
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
              <motion.img
                src="assets/portrait/Portrait-BG.png"
                alt="Portrait-BG"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                  ease: "anticipate",
                }}
              />
              <motion.section
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.75,
                  ease: "anticipate",
                }}
                className="absolute size-[50%] md:size-[60%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 md:border-[0.25vw] border-amber-400 outline-16 md:outline-[0.5vw] outline-amber-400 outline-offset-4"
              />
              <motion.img
                src="assets/portrait/Portrait-FG.png"
                alt="Portrait-FG"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                  ease: "anticipate",
                }}
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
              drag={revealContent}
              dragConstraints={containerRef}
              whileDrag={{ scale: 1.1 }}
              className="absolute origin-bottom-right -translate-x-1/2 -translate-y-1/2 -top-1 left-1 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, ease: "backOut" }}
              data-screen-shakable={true}
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
              }}
              transition={{ filter: { ease: "easeOut" } }}
              className="font-think-loved trim-text-caps text-[clamp(3rem,18cqw,14rem)] stroke-light-1 stroke-16 fill-dark-1 z-2"
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
    </motion.div>
  );
}
