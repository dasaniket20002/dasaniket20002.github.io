import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import Experience from "./experience";
import Featured from "./featured";

export default function Work({ className }: { className?: string }) {
  const { registerSection } = useStickySnap();

  return (
    <SectionContainer
      id="work"
      title="work"
      subTitle="dg/01"
      theme="light"
      className={className}
    >
      <Experience ref={registerSection} id="work-experience" />
      <Featured ref={registerSection} id="work-featured" />
    </SectionContainer>
  );
}
