import { forwardRef } from "react";
import { cn } from "../../utils";
import ExperienceCard from "./experience-card";

interface Designation {
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  descriptions: string[];
  skills?: string[];
}

export interface Experience {
  companyName: string;
  imgUrl: string;
  location: string;
  totalDuration: string;
  designations: Designation[];
}

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

const ExperienceList = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-12", className)}>
      {experiences.map((exp, i) => (
        <ExperienceCard key={i} experience={exp} />
      ))}
    </div>
  ),
);

ExperienceList.displayName = "ExperienceList";

export default ExperienceList;
