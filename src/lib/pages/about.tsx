import { useRef } from "react";
import { cn } from "../utils";
import { useElementSize } from "../hooks/use-element-size";
import { useStickySnap } from "../hooks/use-sticky-snap";
import { motion } from "motion/react";

export default function About({ className }: { className?: string }) {
  const headRef = useRef<HTMLDivElement>(null);
  const { height: headHeight } = useElementSize(headRef);
  const { registerSection } = useStickySnap({ headerRef: headRef });

  return (
    <div
      className={cn("min-h-screen w-full relative", className)}
      style={{ "--head-height": `${headHeight}px` } as React.CSSProperties}
    >
      <section
        ref={headRef}
        data-bg-theme="light"
        className="bg-light-1 flex justify-between items-end px-4 md:px-16 font-think-loved sticky top-0 pt-page"
      >
        <h2 className="text-light-2 text-5xl trim-text-caps">dg/03</h2>
        <h1 className="text-dark-2 text-8xl trim-text-caps">about</h1>
      </section>
      <section
        className="bg-dark-2 h-[calc(100vh-var(--head-height))] place-content-center place-items-center text-center"
        ref={registerSection}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved text-light-2"
        >
          Okay, you can press ctrl+w
        </motion.p>
      </section>
      <section
        className="bg-dark-2 h-[calc(100vh-var(--head-height))] place-content-center place-items-center"
        ref={registerSection}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved text-light-2"
        >
          You are embarrassing me now!
        </motion.p>
      </section>
    </div>
  );
}
