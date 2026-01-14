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
    // amount: "all",
    margin: "-25% 0% -75% 0%",
  });

  return (
    <motion.section
      ref={ref}
      {...motionProps}
      className={cn(
        "place-content-center place-items-center h-[calc(100vh-var(--head-height))] w-full px-8 py-1 golden-grid-container",
        className
      )}
    >
      <div
        ref={inViewContainer}
        className="golden-grid-query max-h-full max-w-full grid aspect-21/34 grid-rows-[8fr_1fr_1fr_3fr_21fr] grid-cols-[5fr_1fr_2fr_13fr] lg:aspect-34/21 lg:grid-cols-[21fr_3fr_1fr_1fr_8fr] lg:grid-rows-[5fr_1fr_2fr_13fr]"
      >
        <div
          className={cn(
            "grid col-span-full row-span-full grid-cols-subgrid grid-rows-subgrid z-1",
            isInView ? "pointer-events-none" : "pointer-events-auto"
          )}
        >
          <motion.span
            className={cn(
              "bg-dark-2 outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "origin-top-right lg:origin-bottom-right",
              "row-start-5 col-start-1 row-end-6 col-end-5",
              "lg:row-start-1 lg:col-start-1 lg:row-end-5 lg:col-end-2"
            )}
            animate={{
              scale: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.5, delay: 0, ease: "linear" }}
          >
            <span className="rounded-br-full lg:rounded-br-none lg:rounded-bl-full inline-block border-b border-r lg:border-r-0 lg:border-l border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "origin-top-left lg:origin-top-right",
              "row-start-1 col-start-4 row-end-5 col-end-5",
              "lg:row-start-4 lg:col-start-2 lg:row-end-5 lg:col-end-6"
            )}
            animate={{
              scale: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.309, delay: 0.5, ease: "linear" }}
          >
            <span className="rounded-tr-full lg:rounded-tr-none lg:rounded-br-full inline-block border-t border-r lg:border-b lg:border-t-0 border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "origin-bottom-left lg:origin-bottom-left",
              "row-start-1 col-start-1 row-end-2 col-end-4",
              "lg:row-start-1 lg:col-start-5 lg:row-end-4 lg:col-end-6"
            )}
            animate={{
              scale: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.1909, delay: 0.809, ease: "linear" }}
          >
            <span className="rounded-tl-full lg:rounded-tl-none lg:rounded-tr-full inline-block border-t border-l lg:border-l-0 lg:border-r border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "origin-bottom-right lg:origin-bottom-right",
              "row-start-2 col-start-1 row-end-5 col-end-2",
              "lg:row-start-1 lg:col-start-2 lg:row-end-2 lg:col-end-5"
            )}
            animate={{
              scale: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.1179, delay: 0.9999, ease: "linear" }}
          >
            <span className="rounded-bl-full lg:rounded-bl-none lg:rounded-tl-full inline-block border-b border-l lg:border-t lg:border-b-0 border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "origin-top-right lg:origin-top-right",
              "row-start-4 col-start-2 row-end-5 col-end-4",
              "lg:row-start-2 lg:col-start-2 lg:row-end-4 lg:col-end-3"
            )}
            animate={{
              scale: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.0726, delay: 1.1178, ease: "linear" }}
          >
            <span className="rounded-br-full lg:rounded-br-none lg:rounded-bl-full inline-block border-b border-r lg:border-r-0 lg:border-l border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "origin-top-left lg:origin-top-left",
              "row-start-2 col-start-3 row-end-4 col-end-4",
              "lg:row-start-3 lg:col-start-3 lg:row-end-4 lg:col-end-5"
            )}
            animate={{
              scale: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.0448, delay: 1.1906, ease: "linear" }}
          >
            <span className="rounded-tr-full lg:rounded-tr-none lg:rounded-br-full inline-block border-t border-r lg:border-b lg:border-t-0 border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "origin-bottom-left lg:origin-bottom-left",
              "row-start-2 col-start-2 row-end-3 col-end-3",
              "lg:row-start-2 lg:col-start-4 lg:row-end-3 lg:col-end-5"
            )}
            animate={{
              scale: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.0276, delay: 1.2354, ease: "linear" }}
          >
            <span className="rounded-tl-full lg:rounded-tl-none lg:rounded-tr-full inline-block border-t border-l lg:border-l-0 lg:border-r border-dark-1/50 size-full" />
          </motion.span>
          <motion.span
            className={cn(
              "bg-dark-2 outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "origin-bottom-right",
              "row-start-3 col-start-2 row-end-4 col-end-3",
              "lg:row-start-2 lg:col-start-3 lg:row-end-3 lg:col-end-4"
            )}
            animate={{
              scale: isInView ? 0 : 1,
              opacity: isInView ? 0.25 : 1,
            }}
            transition={{ duration: 0.017, delay: 1.263, ease: "linear" }}
          >
            <span className="rounded-bl-full lg:rounded-bl-none lg:rounded-tl-full inline-block border-b border-l lg:border-t lg:border-b-0 border-dark-1/50 size-full" />
          </motion.span>
        </div>

        <div className="grid col-span-full row-span-full grid-cols-subgrid grid-rows-subgrid">
          <div
            className={cn(
              "hidden lg:block",
              "row-start-5 col-start-1 row-end-6 col-end-5",
              "lg:row-start-1 lg:col-start-1 lg:row-end-5 lg:col-end-2"
            )}
          ></div>
          <div className="row-start-1 col-start-1 row-end-2 col-end-5 lg:row-start-1 lg:col-start-2 lg:row-end-2 lg:col-end-6 flex items-center p-4">
            <h1 className="text-3xl lg:text-5xl font-think-loved">
              EXPERIENCE
            </h1>
          </div>
          <div className="row-start-2 col-start-1 row-end-6 col-end-5 lg:row-start-2 lg:col-start-2 lg:row-end-5 lg:col-end-6 flex flex-col gap-16">
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
