import { type HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useImperativeHandle, useRef } from "react";
import ScrollRevealText from "../../components/scroll-reveal-text";
import { cn } from "../../utils";

const DISPLAY =
  "| DESIGN is not \n  just DECORATION, \n  but a tool for EMOTION \n  and INFLUENCE. |";
const HIGHLIGHTS = ["DESIGN", "DECORATION", "EMOTION", "INFLUENCE"];

const AboutPage1 = forwardRef<HTMLElement, HTMLMotionProps<"section">>(
  ({ className, ...motionProps }, ref) => {
    const containerRef = useRef<HTMLElement>(null);
    useImperativeHandle(ref, () => containerRef.current!);

    return (
      <m.section
        ref={containerRef}
        className={cn("relative h-[300dvh]! px-32", className)}
        {...motionProps}
      >
        <ScrollRevealText
          displayText={DISPLAY}
          highlights={HIGHLIGHTS}
          containerRef={containerRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: "some" }}
          className={cn(
            "pt-[calc(var(--header-height)+var(--min-section-header-height))] md:pt-[calc(var(--header-height)+var(--section-header-height))]",
            "h-[calc(100dvh-var(--section-header-height))]",
          )}
        />
      </m.section>
    );
  },
);

export default AboutPage1;
