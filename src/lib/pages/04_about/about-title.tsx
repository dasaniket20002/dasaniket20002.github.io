import { useEffect, useMemo, useRef } from "react";
import ScrollTextPressure from "../../components/scroll-text-pressure";
import { cn, getColorPropertyValue } from "../../utils";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { useScroll, useTransform } from "motion/react";
import { formatHex } from "culori";
import * as m from "motion/react-m";

const DISPLAY =
  "/ DESIGN IS NOT\nJUST DECORATION,\nBUT A TOOL FOR EMOTION\nAND INFLUENCE. /";
const HIGHLIGHTS = ["DESIGN", "DECORATION", "EMOTION", "INFLUENCE"];

export default function AboutTitle({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();
  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  const { scrollYProgress: colorChangeProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"],
  });
  const color_l = useMemo(
    () => formatHex(getColorPropertyValue("light-l")),
    [],
  );
  const color_d = useMemo(() => formatHex(getColorPropertyValue("dark-d")), []);

  const backgroundColor = useTransform(
    colorChangeProgress,
    [0, 1],
    [color_l, color_d],
  );

  return (
    <m.div
      ref={containerRef}
      className={cn("relative h-[200dvh] py-16 px-16 md:px-32", className)}
      style={{ backgroundColor }}
    >
      <ScrollTextPressure
        displayText={DISPLAY}
        highlights={HIGHLIGHTS}
        containerRef={containerRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "128px" }}
        className="h-min px-0"
      />
    </m.div>
  );
}
