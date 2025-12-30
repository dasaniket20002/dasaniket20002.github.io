import { P5Canvas, type P5CanvasInstance } from "@p5-wrapper/react";
import { IconLoader2 } from "@tabler/icons-react";
import { animate, AnimatePresence, motion, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { randomRange, wait } from "../utils";
import Key from "./key";
import LogoName from "./logo-name";

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

function LoadingSketch() {
  return (
    <section className="w-1/3 h-96 place-content-center place-items-center flex-none">
      <IconLoader2 className="animate-spin stroke-2 size-4 stroke-light-2" />
    </section>
  );
}

function Counter({ onComplete }: { onComplete: () => void }) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      await wait(1500);

      await animate(count, randomRange(30, 40), {
        duration: 1.5,
        ease: "easeInOut",
      });
      await wait(400);

      await animate(count, randomRange(50, 70), {
        duration: 1.2,
        ease: "easeInOut",
      });
      await wait(500);

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
    <p className="w-full font-think-loved text-5xl text-center">{display}</p>
  );
}

function Message() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const rs: Array<number> = [];
    const generateMessage = () => {
      const r = randomRange(0, LOADING_MESSAGES.length - 1, rs);
      rs.push(r);
      if (rs.length === LOADING_MESSAGES.length) rs.splice(0, rs.length - 2);
      setMessage(LOADING_MESSAGES[r]);
    };
    generateMessage();
    const interval = setInterval(() => generateMessage(), 3000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        exit={{ scaleY: 1, opacity: 0 }}
        key={message}
        className="text-center font-light h-4 origin-top"
        layout
      >
        {message}
      </motion.p>
    </AnimatePresence>
  );
}

export default function Loader({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="relative h-screen z-9998 overflow-y-hidden grid grid-rows-3 py-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 1, ease: "easeInOut" }}
    >
      <motion.div
        className="w-full place-items-center"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{
          duration: 1.2,
          type: "spring",
          ease: "backOut",
          delay: 0.9,
        }}
      >
        <LogoName className="text-2xl text-light-2" />
      </motion.div>

      <motion.div
        className="flex gap-8 items-center justify-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 1,
          type: "spring",
          ease: "backOut",
          delay: 0.5,
        }}
      >
        <Key className="text-2xl size-16 sm:text-4xl sm:size-24">a</Key>
        <P5Canvas loading={LoadingSketch} sketch={sketch} />
        <Key className="text-2xl size-16 sm:text-4xl sm:size-24">d</Key>
      </motion.div>

      <motion.div
        className="w-full px-8 py-4 space-y-1 place-self-end text-light-2"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{
          duration: 1.2,
          type: "spring",
          ease: "backOut",
          delay: 0.9,
        }}
      >
        <Counter onComplete={onComplete} />
        <Message />
      </motion.div>
    </motion.div>
  );
}
