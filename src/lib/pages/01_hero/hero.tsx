import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useScreenShake } from "../../hooks/use-screen-shake";
import { cn } from "../../utils";
import { BottomMarquee } from "./bottom-marquee";
import { BottomSection } from "./bottom-section";
import { MiddleSection } from "./middle-section";
import { TopSection } from "./top-section";

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
        "h-[calc(100vh-var(--header-height))] w-full text-dark-1 -space-y-4 relative flex flex-col",
        "bg-light-1",
        className
      )}
      animate={screenShakeControls}
    >
      <div className="flex flex-col -space-y-4 flex-1 items-center justify-center">
        <TopSection {...{ revealContent, containerRef }} />

        <AnimatePresence mode="wait">
          {revealContent && <MiddleSection shake={shake} />}
        </AnimatePresence>

        <BottomSection {...{ revealContent, containerRef }} />
      </div>

      {revealContent && <BottomMarquee />}
    </motion.div>
  );
}
