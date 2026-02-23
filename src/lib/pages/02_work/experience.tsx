import { useEffect, useRef } from "react";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useElementSize } from "../../hooks/use-element-size";
import ExperienceList, { type Experience } from "./experience-list";
import * as m from "motion/react-m";
import { cn } from "../../utils";

const experiences: Experience[] = [
  {
    companyName: "JMAN Group Pvt.Ltd.",
    imgUrl: "/assets/logos/JMAN Group.png",
    location: "Chennai, Tamil Nadu, India",
    totalDuration: "1yr 9mo",
    designations: [
      {
        title: "Software Engineer",
        type: "Full Time",
        startDate: "Jul 2024",
        endDate: "Sep 2025",
        duration: "1yr 3mo",
        descriptions: [
          "Built a skills tracking platform enabling employees to register skills and project managers to identify suitable team members for ongoing projects.",
          "Developed the frontend for an AI-powered product using modern web technologies, with a Python backend.",
          "Automated Single Customer View (SCV) using Databricks, PySpark, and Splink, improving data unification across multiple CRMs.",
          "Enhanced and maintained a Data Cube application with SQL backend and Power BI frontend, optimizing performance and supporting a client during a major exit process.",
          "Collaborated in a fast-paced environment to fix legacy bugs, integrate new client features, and deliver consistent value across project phases.",
        ],
        skills: [
          "NextJS",
          "React",
          "TailwindCSS",
          "Framer Motion",
          "Tanstack",
          "Typescript",
          "Python",
          "and +5 more",
        ],
      },
      {
        title: "Engineering Intern",
        type: "Full Time",
        startDate: "Jan 2024",
        endDate: "Jul 2025",
        duration: "7mo",
        descriptions: [
          "Completed structured training on company engineering practices and workflow standards.",
          "Gained hands-on experience with the organization's technical stack across frontend, backend, and data pipelines.",
          "Contributed to internal tool development supporting product and data teams.",
        ],
      },
    ],
  },
  {
    companyName: "IDZ Digital Pvt.Ltd.",
    imgUrl: "/assets/logos/IDZ Digital.png",
    location: "Mumbai, Maharashtra, India",
    totalDuration: "5mo",
    designations: [
      {
        title: "Game Developer Intern",
        type: "Full Time",
        startDate: "Jun 2023",
        endDate: "Oct 2023",
        duration: "5mo",
        descriptions: [
          "Developed and optimized ragdoll and rope physics systems for Unity, enabling smooth simulation and rendering of multiple physics segments.",
          "Improved understanding of Unity's physics engine and C# scripting while collaborating in a distributed team.",
          "Built a 3D projection tool for painting and interacting with 3D objects via 2D screen input.",
          "Strengthened communication and teamwork skills through remote collaboration.",
        ],
        skills: [
          "Unity",
          "C#",
          "3D Projection",
          "Physics Engine",
          "Motion",
          "and Blender",
        ],
      },
    ],
  },
];

export default function Experience({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const experienceContainerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const titleRevealY = useTransform(scrollYProgress, [0, 0.25], ["100%", "0%"]);
  const _titleRevealBlur = useTransform(scrollYProgress, [0, 0.25], [3, 0]);
  const titleRevealBlur = useMotionTemplate`blur(${_titleRevealBlur}px)`;

  const titleParallaxTop = useTransform(
    scrollYProgress,
    [0, 1],
    ["100%", "0%"],
  );

  const { height: experienceContainerHeight } = useElementSize(
    experienceContainerRef,
  );

  useEffect(() => {
    registerSection(experienceContainerRef);
  }, [registerSection]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative col-span-full row-span-full grid grid-rows-subgrid grid-cols-subgrid",
        className,
      )}
    >
      <div
        className="relative row-[2/3] md:row-[2/4] col-[2/-2] md:col-[2/3] w-full"
        style={{ height: experienceContainerHeight }}
      >
        <m.div
          style={{ top: titleParallaxTop }}
          className="sticky overflow-hidden"
        >
          <m.h3
            style={{ y: titleRevealY, filter: titleRevealBlur }}
            className="text-4xl font-width-125 font-light tracking-wide"
          >
            EXPERIENCE
          </m.h3>
        </m.div>
      </div>
      <ExperienceList
        ref={experienceContainerRef}
        experiences={experiences}
        className="row-[3/4] md:row-[2/4] col-[2/-2] md:col-[3/5] h-min"
      />
    </div>
  );
}
