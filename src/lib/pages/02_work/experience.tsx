import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { forwardRef, useRef } from "react";
import { cn } from "../../utils";
import ExperienceItem from "./experience-item";

const Experience = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  const inViewContainer = useRef<HTMLDivElement>(null);
  const isInView = useInView(inViewContainer, {
    once: false,
    margin: "-25% 0% -75% 0%",
  });

  return (
    <motion.section
      ref={ref}
      {...motionProps}
      className={cn(
        "place-content-center place-items-center h-[calc(100vh-var(--head-height))] px-8 py-1 @container-[size]",
        className
      )}
    >
      <div
        className={cn(
          "grid [@container(min-aspect-ratio:34/21)]:h-full [@container(max-aspect-ratio:34/21)]:w-full",
          "aspect-21/34 grid-rows-[8fr_1fr_1fr_3fr_21fr] grid-cols-[5fr_1fr_2fr_13fr]",
          "lg:aspect-34/21 lg:grid-cols-[21fr_3fr_1fr_1fr_8fr] lg:grid-rows-[5fr_1fr_2fr_13fr]"
        )}
      >
        <div
          ref={inViewContainer}
          className="pointer-events-none grid col-span-full row-span-full grid-cols-subgrid grid-rows-subgrid z-1"
        >
          <motion.span
            className={cn(
              "bg-dark-2 origin-bottom outline outline-dark-1/10",
              "row-start-5 col-start-1 row-end-6 col-end-5",
              "lg:row-start-1 lg:col-start-1 lg:row-end-5 lg:col-end-2"
            )}
            animate={{
              scaleY: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.5, delay: 0, ease: "easeInOut" }}
          >
            <span className="rounded-bl-full inline-block border-b border-l border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 origin-right outline outline-dark-1/10",
              "row-start-1 col-start-4 row-end-5 col-end-5",
              "lg:row-start-4 lg:col-start-2 lg:row-end-5 lg:col-end-6"
            )}
            animate={{
              scaleX: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.309, delay: 0.5, ease: "easeInOut" }}
          >
            <span className="rounded-br-full inline-block border-b border-r border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 origin-top outline outline-dark-1/10",
              "row-start-1 col-start-1 row-end-2 col-end-4",
              "lg:row-start-1 lg:col-start-5 lg:row-end-4 lg:col-end-6"
            )}
            animate={{
              scaleY: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.1909, delay: 0.809, ease: "easeInOut" }}
          >
            <span className="rounded-tr-full inline-block border-t border-r border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 origin-left outline outline-dark-1/10",
              "row-start-2 col-start-1 row-end-5 col-end-2",
              "lg:row-start-1 lg:col-start-2 lg:row-end-2 lg:col-end-5"
            )}
            animate={{
              scaleX: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.1179, delay: 0.9999, ease: "easeInOut" }}
          >
            <span className="rounded-tl-full inline-block border-t border-l border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 origin-bottom outline outline-dark-1/10",
              "row-start-4 col-start-2 row-end-5 col-end-4",
              "lg:row-start-2 lg:col-start-2 lg:row-end-4 lg:col-end-3"
            )}
            animate={{
              scaleY: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.0726, delay: 1.1178, ease: "easeInOut" }}
          >
            <span className="rounded-bl-full inline-block border-b border-l border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 origin-right outline outline-dark-1/10",
              "row-start-2 col-start-3 row-end-4 col-end-4",
              "lg:row-start-3 lg:col-start-3 lg:row-end-4 lg:col-end-5"
            )}
            animate={{
              scaleX: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.0448, delay: 1.1906, ease: "easeInOut" }}
          >
            <span className="rounded-br-full inline-block border-b border-r border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 origin-top outline outline-dark-1/10",
              "row-start-3 col-start-2 row-end-4 col-end-3",
              "lg:row-start-2 lg:col-start-4 lg:row-end-3 lg:col-end-5"
            )}
            animate={{
              scaleY: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.0276, delay: 1.2354, ease: "easeInOut" }}
          >
            <span className="rounded-tr-full inline-block border-t border-r border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 origin-left outline outline-dark-1/10",
              "row-start-2 col-start-2 row-end-3 col-end-3",
              "lg:row-start-2 lg:col-start-3 lg:row-end-3 lg:col-end-4"
            )}
            animate={{
              scaleX: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.017, delay: 1.263, ease: "easeInOut" }}
          >
            <span className="rounded-tl-full inline-block border-t border-l border-dark-1/50 size-full" />
          </motion.span>
        </div>

        <div className="grid col-span-full row-span-full grid-cols-subgrid grid-rows-subgrid">
          <div
            className={cn(
              "row-start-5 col-start-1 row-end-6 col-end-5",
              "lg:row-start-1 lg:col-start-1 lg:row-end-5 lg:col-end-2"
            )}
          ></div>
          <div className="row-start-1 col-start-2 row-end-2 col-end-6 flex items-center justify-center">
            <h1 className="text-5xl font-think-loved">EXPERIENCE</h1>
          </div>
          <div className="row-start-2 col-start-2 row-end-5 col-end-6 flex flex-col gap-16">
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
              imgClassName="p-4 [&>img]:drop-shadow-xl"
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
        </div>
      </div>
    </motion.section>
  );
});

export default Experience;
