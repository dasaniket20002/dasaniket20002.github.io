import { motion } from "motion/react";
import { useState } from "react";
import ContourCirclesP5 from "../../components/contour-circles-p5";
import GridGolden from "../../components/grid-golden-34-21";
import SectionContainer from "../../components/section-container";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import { cn } from "../../utils";
import ServiceCell from "./service-cell";
import AnimatedTicker from "../../components/animated-ticker";

export default function Services({ className }: { className?: string }) {
  const { registerSection } = useStickySnap();
  const [hoverState, setHoverState] = useState({
    isHovered: false,
    hoverCell: 0,
  });

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
          <motion.div className="grid grid-rows-8 grid-cols-8 gap-3 p-3">
            <ServiceCell
              className={cn(
                !hoverState.isHovered &&
                  hoverState.hoverCell === 0 &&
                  "row-start-1 col-start-1 row-end-5 col-end-5",
                hoverState.isHovered &&
                  hoverState.hoverCell === 1 &&
                  "row-start-1 col-start-1 row-end-6 col-end-6",
                hoverState.isHovered &&
                  hoverState.hoverCell !== 1 &&
                  "row-start-1 col-start-1 row-end-4 col-end-4",
              )}
              cellNum={1}
              hoverState={hoverState}
              setHoverState={setHoverState}
              title="UI/UX Design"
              skills={["User Flow", "Wireframes", "Interactive Prototypes"]}
              description="I design interfaces that balance logic and emotion. They are intuitive from the first click, easy to use, and keep users engaged - helping brands build stronger connections."
            />
            <ServiceCell
              className={cn(
                !hoverState.isHovered &&
                  hoverState.hoverCell === 0 &&
                  "row-start-1 col-start-5 row-end-5 col-end-9",
                hoverState.isHovered &&
                  hoverState.hoverCell === 2 &&
                  "row-start-1 col-start-4 row-end-6 col-end-9",
                hoverState.isHovered &&
                  hoverState.hoverCell !== 2 &&
                  "row-start-1 col-start-6 row-end-4 col-end-9",
              )}
              cellNum={2}
              hoverState={hoverState}
              setHoverState={setHoverState}
              title="Web Design"
              skills={[
                "Modern Layouts",
                "Responsive Design",
                "Clear Navigation",
              ]}
              description="I create websites that stand out from the competition and bring real value to businesses. Each project combines creativity and functionality to deliver the best digital solutions."
            />
            <ServiceCell
              className={cn(
                !hoverState.isHovered &&
                  hoverState.hoverCell === 0 &&
                  "row-start-5 col-start-1 row-end-9 col-end-5",
                hoverState.isHovered &&
                  hoverState.hoverCell === 3 &&
                  "row-start-4 col-start-1 row-end-9 col-end-6",
                hoverState.isHovered &&
                  hoverState.hoverCell !== 3 &&
                  "row-start-6 col-start-1 row-end-9 col-end-4",
              )}
              cellNum={3}
              hoverState={hoverState}
              setHoverState={setHoverState}
              title="Development"
              skills={["Front-end", "Back-end", "Optimization", "Support"]}
              description="Full-cycle development with the best experts — from front-end to back-end. We deliver turnkey projects that are reliable, scalable, and built to last."
            />
            <ServiceCell
              className={cn(
                !hoverState.isHovered &&
                  hoverState.hoverCell === 0 &&
                  "row-start-5 col-start-5 row-end-9 col-end-9",
                hoverState.isHovered &&
                  hoverState.hoverCell === 4 &&
                  "row-start-4 col-start-4 row-end-9 col-end-9",
                hoverState.isHovered &&
                  hoverState.hoverCell !== 4 &&
                  "row-start-6 col-start-6 row-end-9 col-end-9",
              )}
              cellNum={4}
              hoverState={hoverState}
              setHoverState={setHoverState}
              title="Creative Design"
              skills={["Visual Design", "Presentation"]}
              description="My creative design is about visuals that speak for the brand. From eye-catching social media and stylish presentations to thoughtful visual concepts - everything is designed to inspire, connect, and deliver the best digital solutions."
            />
          </motion.div>
          <div className="row-[1/4]! col-[5/6]! size-full place-content-center place-items-center">
            <AnimatedTicker
              value={hoverState.hoverCell}
              fixedPlaces={1}
              showDecimals={false}
              className="text-9xl text-light-2/25 font-think-loved"
            />
          </div>
          <ContourCirclesP5 className="row-[4/5]! col-[2/6]! overflow-hidden rounded-4xl [corner-shape:squircle] m-3 border border-light-2/50" />
        </GridGolden>
      </section>
    </SectionContainer>
  );
}
