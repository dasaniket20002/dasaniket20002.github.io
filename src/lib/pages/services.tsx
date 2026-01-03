import { motion } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { useElementSize } from "../hooks/use-element-size";
import { useStickySnap } from "../hooks/use-sticky-snap";
import { cn } from "../utils";

export default function Services({ className }: { className?: string }) {
  const headRef = useRef<HTMLDivElement>(null);
  const { height: headHeight } = useElementSize(headRef);

  const section1 = useRef<HTMLElement>(null);
  const section2 = useRef<HTMLElement>(null);
  const { registerSection } = useStickySnap();
  useLayoutEffect(() => {
    if (!section1.current || !section2.current || !headHeight) return;

    registerSection(section1.current, { offset: headHeight });
    registerSection(section2.current, { offset: headHeight });
  }, [registerSection, headHeight]);

  return (
    <div
      id="services"
      className={cn("min-h-screen w-full relative", className)}
      style={{ "--head-height": `${headHeight}px` } as React.CSSProperties}
    >
      <section
        ref={headRef}
        data-bg-theme="dark"
        className="bg-dark-2 flex justify-between items-end px-4 md:px-16 font-think-loved sticky top-0 pt-page"
      >
        <h2 className="text-dark-1 text-5xl trim-text-caps">dg/02</h2>
        <h1 className="text-light-1 text-8xl trim-text-caps">services</h1>
      </section>
      <section
        className="bg-light-1 h-[calc(100vh-var(--head-height))] place-content-center place-items-center"
        ref={section1}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved text-dark-1"
        >
          Come back next time!
        </motion.p>
      </section>
      <section
        ref={section2}
        className="bg-light-1 h-[calc(100vh-var(--head-height))] place-content-center place-items-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved text-dark-1"
        >
          I'll be waiting :)
        </motion.p>
      </section>
    </div>
  );
}
