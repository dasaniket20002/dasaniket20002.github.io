import GridGolden from "../../components/grid-golden-34-21";
import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../hooks/use-sticky-snap";

export default function Services({ className }: { className?: string }) {
  const { registerSection } = useStickySnap();

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
        ref={registerSection}
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
