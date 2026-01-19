import { motion } from "motion/react";
import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../hooks/use-sticky-snap";

export default function About({ className }: { className?: string }) {
  const { registerSection } = useStickySnap();

  return (
    <SectionContainer
      id="about"
      title="about"
      subTitle="dg/03"
      theme="light"
      className={className}
    >
      <section
        className="place-content-center place-items-center text-center"
        ref={registerSection}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved"
        >
          Okay, you can press ctrl+w
        </motion.p>
      </section>
      <section
        className="place-content-center place-items-center"
        ref={registerSection}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved"
        >
          You are embarrassing me now!
        </motion.p>
      </section>
    </SectionContainer>
  );
}
