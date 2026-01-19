import { useLayoutEffect, useRef } from "react";
import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import GridGolden from "../../components/grid-golden-34-21";

export default function Services({ className }: { className?: string }) {
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
      id="services"
      title="services"
      subTitle="dg/02"
      theme="dark"
      className={className}
    >
      <section
        className="place-content-center place-items-center @container-[size] p-4"
        ref={section1}
      >
        <GridGolden
          landscapeConvergeQuadrant="top-right"
          portraitConvergeQuadrant="bottom-right"
        />
        {/* <ContourCirclesP5 className="h-full aspect-square" /> */}
      </section>
    </SectionContainer>
  );
}
