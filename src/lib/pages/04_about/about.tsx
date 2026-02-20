import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import AboutContent from "./about-content";
import AboutPage1 from "./about-page-1";

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
      <AboutPage1 ref={registerSection} />
      <AboutContent ref={registerSection} />
    </SectionContainer>
  );
}
