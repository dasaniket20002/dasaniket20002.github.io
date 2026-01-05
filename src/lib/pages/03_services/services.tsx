import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../hooks/use-sticky-snap";

export default function Services({ className }: { className?: string }) {
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
      id="services"
      title="services"
      subTitle="dg/02"
      theme="dark"
      onHeaderHeightChange={(h) => setHeadHeight(h)}
      className={className}
    >
      <section
        className="place-content-center place-items-center"
        ref={section1}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved"
        >
          Come back next time!
        </motion.p>
      </section>
      <section
        ref={section2}
        className="place-content-center place-items-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved"
        >
          I'll be waiting :)
        </motion.p>
      </section>
    </SectionContainer>
  );
}
