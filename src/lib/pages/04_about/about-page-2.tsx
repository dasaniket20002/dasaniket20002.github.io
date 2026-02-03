import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import ScrollRevealText from "../../components/scroll-reveal-text";
import { cn } from "../../utils";

const DISPLAY = "/ IT'S NOT \n JUST A DESIGN, \n IT'S A WAY OF THINKING. /";
const HIGHLIGHTS = ["DESIGN", "THINKING"];

const AboutPage2 = forwardRef<HTMLElement, HTMLMotionProps<"section">>(
  ({ className, ...motionProps }, ref) => {
    const containerRef = useRef<HTMLElement>(null);
    useImperativeHandle(ref, () => containerRef.current!);

    return (
      <motion.section
        ref={containerRef}
        className={cn("relative h-[200vh]!", className)}
        {...motionProps}
      >
        <ScrollRevealText
          displayText={DISPLAY}
          highlights={HIGHLIGHTS}
          containerRef={containerRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: "all" }}
          className="px-16 pt-[calc(var(--header-height)+var(--min-section-header-height))] md:pt-[calc(var(--header-height)+var(--section-header-height))]"
        />
      </motion.section>
    );
  },
);

export default AboutPage2;
