import { useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { cn } from "../../utils";
import { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import ExperienceItem from "./experience-item";
import { useElementSize } from "../../hooks/use-element-size";

export default function Work({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const { registerSection } = useStickySnap();

  const { scrollYProgress: scrollReveal } = useScroll({
    target: containerRef,
    offset: ["start end", "start center"],
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const revealY = useTransform(scrollReveal, [0, 0.95], ["100%", "0%"]);
  const _revealBlur = useTransform(scrollReveal, [0, 0.95], [3, 0]);
  const revealBlur = useMotionTemplate`blur(${_revealBlur}px)`;

  const containerSize = useElementSize(containerRef);
  const titleSize = useElementSize(titleRef);
  const contentSize = useElementSize(contentRef);

  const titleRange = containerSize.height - titleSize.height;
  const contentRange = containerSize.height - contentSize.height;

  const titleTop = useTransform(scrollYProgress, [0, 1], [0, titleRange]);
  const contentTop = useTransform(scrollYProgress, [0, 1], [0, contentRange]);

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  return (
    <div
      ref={containerRef}
      data-bg-theme="dark"
      id="work"
      className={cn(
        "h-dvh w-full relative grid overflow-clip",
        "grid-cols-[4rem_1fr_1fr_1fr_4rem]",
        "md:grid-cols-[8rem_1fr_1fr_1fr_8rem]",
        className,
      )}
    >
      <div className="col-span-full row-span-full"></div>

      <div className="relative col-[2/3] row-[1/2]">
        <m.div
          ref={titleRef}
          style={{ top: titleTop }}
          className="absolute inset-x-0 overflow-hidden"
        >
          <m.h3
            style={{ y: revealY, filter: revealBlur }}
            className="text-5xl font-width-120 font-bold uppercase"
          >
            Experience
          </m.h3>
        </m.div>
      </div>

      <div className="relative col-[3/5] row-[1/2]">
        <m.section
          ref={contentRef}
          style={{ top: contentTop }}
          className="absolute inset-x-0 flex gap-16"
        >
          <div className="relative flex flex-col">
            <span className="w-px h-full bg-dark-l/25" />
            <m.span
              style={{ height: progressHeight }}
              className="absolute left-0 right-0 top-0 bg-dark-l"
            />
          </div>

          <div className="flex flex-col gap-16 w-full">
            <ExperienceItem
              imgSrc="assets/logos/JMAN Group.png"
              imgAlt="JMAN Group"
              title="Software Developer"
              company="JMAN Group Pvt.Ltd."
              url="https://jmangroup.com/"
              location="Chennai, India"
              period="Jul/2024 - Sep/2025"
              description={[
                "Built a skills tracking platform enabling employees to register skills and project managers to identify suitable team members for ongoing projects.",
                "Developed the frontend for an AI-powered product using modern web technologies, with a Python backend.",
                "Automated Single Customer View (SCV) using Databricks, PySpark, and Splink, improving data unification across multiple CRMs.",
                "Enhanced and maintained a Data Cube application with SQL backend and Power BI frontend, optimizing performance and supporting a client during a major exit process.",
                "Collaborated in a fast-paced environment to fix legacy bugs, integrate new client features, and deliver consistent value across project phases.",
              ]}
            />
            <ExperienceItem
              imgSrc="assets/logos/IDZ Digital.png"
              imgAlt="IDZ Digital"
              title="Game Developer"
              company="IDZ Digital Pvt.Ltd."
              url="https://www.idzdigital.com/"
              location="Mumbai, India"
              period="Jun/2023 - Oct/2023"
              description={[
                "Developed and optimized ragdoll and rope physics systems for Unity, enabling smooth simulation and rendering of multiple physics segments.",
                "Improved understanding of Unity's physics engine and C# scripting while collaborating in a distributed team.",
                "Built a 3D projection tool for painting and interacting with 3D objects via 2D screen input.",
                "Strengthened communication and teamwork skills through remote collaboration.",
              ]}
              imgClassName="p-6"
            />
          </div>
        </m.section>
      </div>
    </div>
  );
}
