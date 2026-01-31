import { IconPlayerTrackNextFilled } from "@tabler/icons-react";
import { useLenis } from "lenis/react";
import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useState } from "react";
import GridGolden from "../../components/grid-golden-34-21";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import { cn } from "../../utils";
import ExperienceItem from "./experience-item";
import { ExperienceRevealAnimation } from "./experience-reveal-animation";
import { MIN_SECTION_HEADER_HEIGHT, SECTION_HEADER_HEIGHT } from "../../../App";
import { useWindowSize } from "../../hooks/use-window-size";

const Experience = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  const [hoverLocation, setHoverLocation] = useState<"code" | "game">();
  const lenis = useLenis();
  const { lockSnap, unlockSnap } = useStickySnap();
  const containerSize = useWindowSize();
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
        <div className="relative size-full flex flex-col gap-8 p-4">
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
            className="row-start-2 flex-2 flex"
            triggerClassName="px-16 py-12 place-content-center"
            imgClassName="h-8/10"
            titleClassName="text-6xl"
            subtitleClassName="text-2xl"
            footerClassName="text-base"
            onMouseEnter={() => setHoverLocation("code")}
            onMouseLeave={() => setHoverLocation(undefined)}
          />
          <ExperienceRevealAnimation hoverLocation={hoverLocation} />
        </div>
        <div className="relative size-full flex flex-col gap-4 p-4">
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
            className="flex flex-1"
            triggerClassName="px-6 py-4 place-content-center"
            imgClassName="h-8/10 p-5"
            titleClassName="text-5xl"
            subtitleClassName="text-xl"
            footerClassName="text-base"
            onMouseEnter={() => setHoverLocation("game")}
            onMouseLeave={() => setHoverLocation(undefined)}
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-think-loved row-[1/2]! col-[1/5]! place-self-center">
          EXPERIENCE
        </h1>

        <motion.button
          initial={{ rotate: "0deg" }}
          whileHover={{ rotate: "90deg" }}
          transition={{
            ease: "anticipate",
            duration: 0.25,
            type: "spring",
            bounce: 0.5,
          }}
          onClick={(e) => {
            e.preventDefault();
            lockSnap();
            lenis?.scrollTo("#work-featured", {
              onComplete: unlockSnap,
              offset:
                -1 *
                (containerSize.width > containerSize.height
                  ? SECTION_HEADER_HEIGHT
                  : MIN_SECTION_HEADER_HEIGHT),
            });
          }}
          className="group size-full place-items-center place-content-center cursor-pointer row-[2/4]! col-[4/5]!"
        >
          <IconPlayerTrackNextFilled className="size-7/10 group-hover:stroke-dark-1 transition" />
        </motion.button>
      </GridGolden>
    </motion.section>
  );
});

export default Experience;
