import { useLayoutEffect, useRef } from "react";
import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import Experience from "./experience";
import Featured from "./featured";

export default function Work({ className }: { className?: string }) {
  const section1 = useRef<HTMLElement>(null);
  const section2 = useRef<HTMLElement>(null);
  const { registerSection } = useStickySnap();
  useLayoutEffect(() => {
    if (section1.current)
      registerSection(section1.current, { useDefaultHeaderHeight: true });
    if (section2.current)
      registerSection(section2.current, { useDefaultHeaderHeight: true });
  }, [registerSection]);

  return (
    <SectionContainer
      id="work"
      title="work"
      subTitle="dg/01"
      theme="light"
      className={className}
    >
      <Experience ref={section1} />
      <Featured ref={section2} />
    </SectionContainer>
  );
}
