import * as m from "motion/react-m";
import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../hooks/use-sticky-snap";

export default function Contact({ className }: { className?: string }) {
  const { registerSection } = useStickySnap();

  return (
    <SectionContainer
      id="contact"
      title="contact"
      subTitle="dg/04"
      theme="dark"
      className={className}
    >
      <section
        className="place-content-center place-items-center"
        ref={registerSection}
      >
        <m.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, amount: "some", margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved"
        >
          WIP
        </m.p>
      </section>
    </SectionContainer>
  );
}
