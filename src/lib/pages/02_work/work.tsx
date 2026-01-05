import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import Experience from "./experience";

export default function Work({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [headHeight, setHeadHeight] = useState(0);

  const section1 = useRef<HTMLElement>(null);
  const section2 = useRef<HTMLElement>(null);
  const { registerSection } = useStickySnap();
  useLayoutEffect(() => {
    if (!headHeight) return;

    if (section1.current)
      registerSection(section1.current, { offset: headHeight });
    if (section2.current)
      registerSection(section2.current, { offset: headHeight });
  }, [registerSection, headHeight]);

  return (
    <SectionContainer
      ref={containerRef}
      id="work"
      title="work"
      subTitle="dg/01"
      theme="light"
      onHeaderHeightChange={(h) => setHeadHeight(h)}
      className={className}
    >
      <Experience ref={section1} />

      <section
        className="place-content-center place-items-center text-center"
        ref={section2}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved"
        >
          Please Hold on!
        </motion.p>
      </section>
    </SectionContainer>
  );
}
