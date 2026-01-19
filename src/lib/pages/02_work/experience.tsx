import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";
import GridGolden from "../../components/grid-golden-34-21";
import SedimentaryGrooveP5 from "../../components/sedimentary-groove-p5";
import { useWindowSize } from "../../hooks/use-window-size";
import { cn } from "../../utils";
import ExperienceItem from "./experience-item";

const Experience = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  const { width, height } = useWindowSize();
  return (
    <motion.section
      ref={ref}
      {...motionProps}
      className={cn(
        "place-content-center place-items-center @container-[size] w-full px-8 py-1",
        className,
      )}
    >
      <GridGolden
        landscapeConvergeQuadrant="top-left"
        portraitConvergeQuadrant="top-left"
        borderTheme="dark"
      >
        <div
          className={cn(
            "flex flex-col gap-16 py-4 px-6 items-start justify-center place-self-center max-w-min",
            width / height <= 1 && "row-span-full! col-span-full! items-center",
          )}
        >
          <h1 className="text-3xl lg:text-5xl font-think-loved px-24">
            EXPERIENCE
          </h1>

          <ExperienceItem
            imgSrc="assets/logos/JMAN Group.png"
            imgAlt="JMAN Group"
            imgClassName="p-2 [&>img]:drop-shadow-xl"
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
          />

          <ExperienceItem
            imgSrc="assets/logos/IDZ Digital.png"
            imgAlt="IDZ Digital"
            imgClassName="p-4"
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
          />
        </div>
        {width / height > 1 && (
          <>
            <SedimentaryGrooveP5
              className="h-full p-1"
              containerClassName="[corner-shape:squircle] rounded-full overflow-hidden shadow-2xl"
            />
            <SedimentaryGrooveP5
              className="h-full p-1"
              containerClassName="[corner-shape:squircle] rounded-full overflow-hidden shadow-2xl"
            />
            <SedimentaryGrooveP5
              className="h-full p-1"
              containerClassName="[corner-shape:squircle] rounded-full overflow-hidden shadow-2xl"
            />
          </>
        )}
      </GridGolden>
    </motion.section>
  );
});

export default Experience;
