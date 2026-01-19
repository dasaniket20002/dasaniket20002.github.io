import ContourCirclesP5 from "../../components/contour-circles-p5";
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
        className="place-content-center place-items-center @container-[size] p-1"
        ref={registerSection}
      >
        <GridGolden
          landscapeConvergeQuadrant="top-right"
          portraitConvergeQuadrant="top-right"
        >
          <ContourCirclesP5 className="row-[4/5]! col-[2/6]! overflow-hidden rounded-full [corner-shape:squircle] border border-dark-2/25 border-dashed" />
        </GridGolden>
      </section>
    </SectionContainer>
  );
}
