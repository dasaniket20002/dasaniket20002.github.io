import { useLayoutEffect, useRef, useState } from "react";
import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import Experience from "./experience";
import Featured from "./featured";
import Experience2 from "./experience2";

export default function Work({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [headHeight, setHeadHeight] = useState(0);

  const section1 = useRef<HTMLElement>(null);
  const section2 = useRef<HTMLElement>(null);
  const section3 = useRef<HTMLElement>(null);
  const { registerSection } = useStickySnap();
  useLayoutEffect(() => {
    if (!headHeight) return;

    if (section1.current)
      registerSection(section1.current, { offset: headHeight });
    if (section2.current)
      registerSection(section2.current, { offset: headHeight });
    if (section3.current)
      registerSection(section3.current, { offset: headHeight });
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
      <Featured ref={section2} />
      <Experience2 ref={section3} />
    </SectionContainer>
  );
}
