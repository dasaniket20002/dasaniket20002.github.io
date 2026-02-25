import { useMotionTemplate, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef } from "react";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { useElementSize } from "../../hooks/use-element-size";
import { useWindowSize } from "../../hooks/use-window-size";
import { cn } from "../../utils";
import ServiceCard from "./service-card";

const services = [
  {
    title: "UI/UX Design",
    items: ["/ User Flow", "/ Wireframes", "/ Interactive Prototypes"],
    description:
      "I design interfaces that balance logic and emotion. They are intuitive from the first click, easy to use, and keep users engaged - helping brands build stronger connections.",
  },
  {
    title: "Web Design",
    items: ["/ Modern Layout", "/ Responsive Design", "/ Clear Navigation"],
    description:
      "I create websites that stand out from the competition and bring real value to businesses. Each project combines creativity and functionality to deliver the best digital solutions.",
  },
  {
    title: "Development",
    items: ["/ Front-end", "/ Back-end", "/ Optimization", "/ Support"],
    description:
      "Full-cycle development with the best experts - from front-end to back-end. We deliver turnkey projects that are reliable, scalable, and built to last.",
  },
  {
    title: "Creative Design",
    items: ["/ Visual Design", "/ Presentation"],
    description:
      "My creative design is about visuals that speak for the brand. From eye-catching social media and stylish presentations to thoughtful visual concepts - everything is designed to inspire, connect, and deliver the best digital solutions.",
  },
];

export default function Services({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealHeaderRef = useRef<HTMLDivElement>(null);
  const serviceContainerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();
  const { width: windowWidth } = useWindowSize();
  const { height: serviceContainerHeight } =
    useElementSize(serviceContainerRef);

  const { scrollYProgress: revealProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 0.75"],
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["-0.25 end", "end start"],
  });

  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"],
  });

  const titleRevealY = useTransform(revealProgress, [0, 1], ["100%", "0%"]);

  const _revealBlur = useTransform(revealProgress, [0, 1], [3, 0]);
  const _exitBlur = useTransform(exitProgress, [0.8, 1], [0, 3]);
  const _titleBlur = useTransform([_revealBlur, _exitBlur], ([reveal, exit]) =>
    Math.max(reveal as number, exit as number),
  );
  const titleRevealBlur = useMotionTemplate`blur(${_titleBlur}px)`;

  const titleParallaxTop = useTransform(
    scrollYProgress,
    [0, 1],
    ["100%", "0%"],
  );

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  return (
    <div
      ref={containerRef}
      id="services"
      className={cn(
        "relative grid gap-y-12 md:gap-y-0 py-16 min-h-dvh",
        "grid-cols-[4rem_1fr_4rem] grid-rows-[auto_1fr]",
        "md:grid-cols-[8rem_1fr_1fr_1fr_8rem]",
        className,
      )}
    >
      <div
        ref={revealHeaderRef}
        className="sticky top-16 md:relative md:top-0 row-[1/2] md:row-[1/3] col-[2/-2] md:col-[2/3] w-full z-1"
        style={{
          height: windowWidth >= 768 ? serviceContainerHeight : "auto",
        }}
      >
        <m.div
          style={{ top: windowWidth >= 768 ? titleParallaxTop : 0 }}
          className="sticky mask-b-from-80% inline-flex"
        >
          <m.h3
            style={{ y: titleRevealY, filter: titleRevealBlur }}
            className="text-4xl font-width-125 font-light tracking-wide"
          >
            SERVICES
          </m.h3>
        </m.div>
      </div>
      <div
        ref={serviceContainerRef}
        className="row-[2/3] md:row-[1/3] col-[2/-2] md:col-[3/5] flex flex-col gap-32 justify-around h-full"
      >
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            items={service.items}
            description={service.description}
          />
        ))}
      </div>
    </div>
  );
}
