import { type HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef } from "react";
import TextPressure from "../../components/text-pressure";
import { cn } from "../../utils";
import ExperienceItem from "./experience-item";

const Experience = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  return (
    <m.section
      ref={ref}
      {...motionProps}
      className={cn(
        "grid grid-cols-[8rem_1fr_1fr_1fr_1fr_8rem] grid-rows-6",
        className,
      )}
    >
      <div className="row-span-full col-span-full grid grid-cols-subgrid grid-rows-subgrid opacity-25 mask-t-from-95% mask-b-from-95% mask-l-from-95% mask-r-from-95% pointer-events-none">
        <div className="row-span-full col-[1/2] border-r border-b border-dark-1" />
        <div className="row-span-full col-[-1/-2] border-l border-b border-dark-1" />
        <div className="row-[1/4] col-[1/4] border-r border-b border-dark-1" />
        <div className="row-[4/7] col-[1/4] border-r border-dark-1" />
      </div>
      <div className="row-span-full col-[2/-2] grid grid-cols-subgrid grid-rows-subgrid p-1 gap-2">
        <ExperienceItem
          imgSrc="assets/logos/JMAN Group.png"
          imgAlt="JMAN Group"
          title="Software Developer"
          company="JMAN Group Pvt.Ltd."
          url="https://jmangroup.com/"
          location="Chennai, India (On-site)"
          period="Jul/2024 - Sep/2025"
          description={[
            "Built a skills tracking platform enabling employees to register skills and project managers to identify suitable team members for ongoing projects.",
            "Developed the frontend for an AI-powered product using modern web technologies, with a Python backend.",
            "Automated Single Customer View (SCV) using Databricks, PySpark, and Splink, improving data unification across multiple CRMs.",
            "Enhanced and maintained a Data Cube application with SQL backend and Power BI frontend, optimizing performance and supporting a client during a major exit process.",
            "Collaborated in a fast-paced environment to fix legacy bugs, integrate new client features, and deliver consistent value across project phases.",
          ]}
          className="row-[1/4] col-[1/3] flex"
          triggerClassName="px-16 py-12 place-content-center"
          imgClassName="h-8/10"
          titleClassName="text-6xl"
          subtitleClassName="text-2xl"
          footerClassName="text-base"
        />
        <ExperienceItem
          imgSrc="assets/logos/IDZ Digital.png"
          imgAlt="IDZ Digital"
          title="Game Developer"
          company="IDZ Digital Pvt.Ltd."
          url="https://www.idzdigital.com/"
          location="Mumbai, India (Remote)"
          period="Jun/2023 - Oct/2023"
          description={[
            "Developed and optimized ragdoll and rope physics systems for Unity, enabling smooth simulation and rendering of multiple physics segments.",
            "Improved understanding of Unity's physics engine and C# scripting while collaborating in a distributed team.",
            "Built a 3D projection tool for painting and interacting with 3D objects via 2D screen input.",
            "Strengthened communication and teamwork skills through remote collaboration.",
          ]}
          className="row-[4/7] col-[1/3] flex"
          triggerClassName="px-16 py-12 place-content-center"
          imgClassName="h-8/10"
          titleClassName="text-6xl"
          subtitleClassName="text-2xl"
          footerClassName="text-base"
        />

        <div className="relative size-full row-span-full col-[3/4] pt-(--min-section-header-height) md:pt-(--section-header-height)">
          <TextPressure
            text="EXPERIENCE"
            writingMode="vertical-rl"
            className="text-9xl"
            textColor="var(--color-light-1)"
          />
        </div>
      </div>
    </m.section>
  );
});

export default Experience;
