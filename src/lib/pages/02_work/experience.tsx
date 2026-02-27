import { useEffect, useRef } from "react";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useElementSize } from "../../hooks/use-element-size";
import ExperienceList, { type Experience } from "./experience-list";
import * as m from "motion/react-m";
import { cn } from "../../utils";
import { useWindowSize } from "../../hooks/use-window-size";

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
  const { width: windowWidth } = useWindowSize();

  // Reveal animation — always covers exactly 25vh of scrolling, regardless of container height
  const { scrollYProgress: revealProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start center"], // top of container: viewport bottom → 25% into viewport
  });

  // Overall progress — for parallax and other size-dependent effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["-0.25 end", "end start"],
  });

  // Exit animation — fixed viewport distance for the blur-out
  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"], // bottom of container: viewport bottom → viewport top (1vh)
  });

  const titleRevealY = useTransform(revealProgress, [0, 1], ["100%", "0%"]);

  // Combine entry blur and exit blur
  const _revealBlur = useTransform(revealProgress, [0, 1], [3, 0]);
  const _exitBlur = useTransform(exitProgress, [0.8, 1], [0, 3]);
  const _titleBlur = useTransform<number, number>(
    [_revealBlur, _exitBlur],
    ([reveal, exit]) => Math.max(reveal, exit),
  );
  const titleRevealBlur = useMotionTemplate`blur(${_titleBlur}px)`;

  const titleParallaxTop = useTransform(
    scrollYProgress,
    [0, 1],
    ["100%", "0%"],
  );

  const { height: experienceContainerHeight } = useElementSize(
    experienceContainerRef,
  );

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  return (
    <div
      ref={containerRef}
      id="work"
      className={cn(
        "relative grid gap-y-12 md:gap-y-0 py-16",
        "grid-cols-[4rem_1fr_4rem] grid-rows-[auto_1fr]",
        "md:grid-cols-[8rem_1fr_1fr_1fr_8rem]",
        className,
      )}
    >
      <div
        className="sticky top-16 md:relative md:top-0 row-[1/2] md:row-[1/3] col-[2/-2] md:col-[2/3] w-full z-1 mix-blend-difference"
        style={{
          height: windowWidth >= 768 ? experienceContainerHeight : "auto",
        }}
      >
        <m.div
          style={{ top: windowWidth >= 768 ? titleParallaxTop : 0 }}
          className="sticky flex flex-col"
        >
          <div className="mask-b-from-80%">
            <m.h3
              style={{ y: titleRevealY, filter: titleRevealBlur }}
              className="text-4xl font-width-125 font-light tracking-wide uppercase"
            >
              what i have done
            </m.h3>
          </div>
          <div className="mask-b-from-80%">
            <m.p
              style={{ y: titleRevealY, filter: titleRevealBlur }}
              className="text-xl font-width-120 font-extralight tracking-wide uppercase"
            >
              so far...
            </m.p>
          </div>
        </m.div>
      </div>
      <ExperienceList
        ref={experienceContainerRef}
        experiences={experiences}
        className="max-w-5xl row-[2/3] md:row-[1/3] col-[2/-2] md:col-[3/5] h-min"
      />
    </div>
  );
}
