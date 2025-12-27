import { P5Canvas, type P5CanvasInstance } from "@p5-wrapper/react";
import { IconLoader2 } from "@tabler/icons-react";
import { animate, AnimatePresence, motion, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { randomRange, wait } from "../utils";
import Key from "./key";

const LOADING_MESSAGES = [
  "Aligning pixels...",
  "Convincing the internet to cooperate...",
  "Making it look intentional...",
  "Warming up the servers.",
  "Applying duct tape.",
  "Running on caffeine and hope.",
  "npm install patience...",
  "Have you tried turning it off and on again?",
  "Blame the cache.",
  "Summoning semicolons...",
  "Still faster than Jira.",
  "Loading the loading message...",
  "Consulting the crystal ball...",
  "This message is here so you don't feel ignored.",
  "Yes, this is actually loading.",
  "I could've shown a spinner. I chose chaos.",
];

function sketch(p5: P5CanvasInstance) {
  p5.setup = () => p5.createCanvas(p5.windowWidth / 3, 384, p5.WEBGL);

  p5.draw = () => {
    p5.background(0, 0, 0, 0);
    p5.normalMaterial();
    p5.push();
    p5.rotateZ(p5.frameCount * 0.01);
    p5.rotateX(p5.frameCount * 0.01);
    p5.rotateY(p5.frameCount * 0.01);
    p5.plane(100);
    p5.pop();
  };
}

const LoadingSketch = () => {
  return (
    <section className="w-1/3 h-96 place-content-center place-items-center flex-none">
      <IconLoader2 className="animate-spin stroke-2 size-4 stroke-light-2" />
    </section>
  );
};

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const sequence = async () => {
      setMessage("");
      await wait(1500);

      const r1 = randomRange(0, LOADING_MESSAGES.length - 1);
      setMessage(LOADING_MESSAGES[r1]);

      await animate(count, randomRange(30, 40), {
        duration: 1.2,
        ease: "easeInOut",
      });
      await wait(400);
      const r2 = randomRange(0, LOADING_MESSAGES.length - 1, [r1]);
      setMessage(LOADING_MESSAGES[r2]);

      await animate(count, randomRange(50, 70), {
        duration: 1.5,
        ease: "easeInOut",
      });
      await wait(500);
      const r3 = randomRange(0, LOADING_MESSAGES.length - 1, [r1, r2]);
      setMessage(LOADING_MESSAGES[r3]);

      await animate(count, 100, { duration: 1, ease: "easeInOut" });

      await wait(500);
      onComplete();
    };

    sequence();
  }, [count, onComplete]);

  count.on("change", (latest) => {
    setDisplay(Math.round(latest));
  });

  return (
    <motion.div
      className="relative h-screen z-9998 overflow-y-hidden grid grid-rows-3 py-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        className="w-full font-think-loved text-2xl flex gap-2 items-start justify-center text-dark-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.75,
          type: "spring",
          ease: "easeIn",
          delay: 0.7,
        }}
      >
        <section className="flex items-center gap-2">
          <span>A</span>
          <span className="h-1 w-[2ch] flex-none bg-dark-1" />
          <span>D</span>
        </section>
      </motion.div>

      <motion.div
        className="flex gap-8 items-center justify-center w-full"
        initial={{ opacity: 0, translateY: "10%" }}
        animate={{ opacity: 1, translateY: "0%" }}
        exit={{ opacity: 0, translateY: "-10%" }}
        transition={{
          duration: 0.75,
          type: "spring",
          ease: "easeIn",
          delay: 0.5,
        }}
      >
        <Key className="text-2xl size-16 sm:text-4xl sm:size-24">a</Key>
        <P5Canvas loading={LoadingSketch} sketch={sketch} />
        <Key className="text-2xl size-16 sm:text-4xl sm:size-24">d</Key>
      </motion.div>

      <motion.div
        className="w-full px-8 py-4 space-y-1 place-self-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.75,
          type: "spring",
          ease: "easeIn",
          delay: 0.9,
        }}
      >
        <p className="w-full font-think-loved text-5xl text-center text-light-2">
          {display}
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 1, opacity: 0 }}
            key={message}
            className="text-center font-helvetica font-light text-light-2 h-4 origin-top"
            layout
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
