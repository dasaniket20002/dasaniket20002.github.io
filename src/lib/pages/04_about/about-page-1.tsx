import { type HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useImperativeHandle, useRef } from "react";
import ScrollRevealText from "../../components/scroll-reveal-text";
import { cn } from "../../utils";

const DISPLAY =
  "/ DESIGN IS NOT \n JUST DECORATION, \n BUT A TOOL FOR EMOTION \n AND INFLUENCE. /";
const HIGHLIGHTS = ["DESIGN", "DECORATION", "EMOTION", "INFLUENCE"];

const AboutPage1 = forwardRef<HTMLElement, HTMLMotionProps<"section">>(
  ({ className, ...motionProps }, ref) => {
    const containerRef = useRef<HTMLElement>(null);
    useImperativeHandle(ref, () => containerRef.current!);

    return (
      <m.section
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
      </m.section>
    );
  },
);

export default AboutPage1;
