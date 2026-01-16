import {
  AnimatePresence,
  motion,
  useInView,
  type HTMLMotionProps,
} from "motion/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import SedimentaryGrooveP5 from "../../components/sedimentary-groove-p5";
import { useWindowSize } from "../../hooks/use-window-size";
import { cn } from "../../utils";
import ExperienceItem from "./experience-item";

const Experience = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, {
    once: false,
    margin: "-25% 0% -75% 0%",
  });
  const { width: windowWidth } = useWindowSize();

  useImperativeHandle(ref, () => containerRef.current as HTMLElement);

  return (
    <motion.section
      ref={containerRef}
      {...motionProps}
      className={cn(
        "place-content-center place-items-center h-[calc(100vh-var(--min-section-header-height))] md:h-[calc(100vh-var(--section-header-height))] @container-[size] w-full px-8 py-1",
        className
      )}
    >
      <div
        className={cn(
          "[--ar-w:21] [--ar-h:34] lg:[--ar-w:34] lg:[--ar-h:21]",
          "aspect-[calc(var(--ar-w)/var(--ar-h))] w-[min(100cqw,calc(100cqh*var(--ar-w)/var(--ar-h)))]",
          "grid",
          "grid-rows-[8fr_1fr_1fr_3fr_21fr] grid-cols-[5fr_1fr_2fr_13fr]",
          "lg:grid-cols-[21fr_3fr_1fr_1fr_8fr] lg:grid-rows-[5fr_1fr_2fr_13fr]"
        )}
      >
        <div
          className={cn(
            "grid col-span-full row-span-full grid-cols-subgrid grid-rows-subgrid z-1",
            isInView ? "pointer-events-none" : "pointer-events-auto"
          )}
        >
          <motion.span
            className={cn(
              "relative outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "row-start-5 col-start-1 row-end-6 col-end-5",
              "lg:row-start-1 lg:col-start-1 lg:row-end-5 lg:col-end-2"
            )}
          >
            <motion.span
              className="absolute inset-0 bg-dark-2 size-full"
              animate={{
                opacity: isInView ? 0 : 1,
              }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.span
              animate={{
                scale: isInView ? 0 : 1,
              }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeIn" }}
              className="absolute inset-0 z-1 origin-top-right lg:origin-bottom-right rounded-br-full lg:rounded-br-none lg:rounded-bl-full inline-block border-b border-r lg:border-r-0 lg:border-l border-dark-1/50 size-full"
            />
          </motion.span>
          <motion.span
            className={cn(
              "relative outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "row-start-1 col-start-4 row-end-5 col-end-5",
              "lg:row-start-4 lg:col-start-2 lg:row-end-5 lg:col-end-6"
            )}
          >
            <motion.span
              className="absolute inset-0 bg-dark-2 size-full"
              animate={{
                opacity: isInView ? 0 : 1,
              }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.span
              animate={{
                scale: isInView ? 0 : 1,
              }}
              transition={{ duration: 0.309, delay: 1, ease: "linear" }}
              className="origin-top-left lg:origin-top-right absolute inset-0 z-1 rounded-tr-full lg:rounded-tr-none lg:rounded-br-full inline-block border-t border-r lg:border-b lg:border-t-0 border-dark-1/50 size-full"
            />
          </motion.span>
          <motion.span
            className={cn(
              "relative outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "row-start-1 col-start-1 row-end-2 col-end-4",
              "lg:row-start-1 lg:col-start-5 lg:row-end-4 lg:col-end-6"
            )}
          >
            <motion.span
              className="absolute inset-0 bg-dark-2 size-full"
              animate={{
                opacity: isInView ? 0 : 1,
              }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.span
              animate={{
                scale: isInView ? 0 : 1,
              }}
              transition={{ duration: 0.1909, delay: 1.309, ease: "linear" }}
              className="origin-bottom-left lg:origin-bottom-left absolute inset-0 z-1 rounded-tl-full lg:rounded-tl-none lg:rounded-tr-full inline-block border-t border-l lg:border-l-0 lg:border-r border-dark-1/50 size-full"
            />
          </motion.span>
          <motion.span
            className={cn(
              "relative outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "row-start-2 col-start-1 row-end-5 col-end-2",
              "lg:row-start-1 lg:col-start-2 lg:row-end-2 lg:col-end-5"
            )}
          >
            <motion.span
              className="absolute inset-0 bg-dark-2 size-full"
              animate={{
                opacity: isInView ? 0 : 1,
              }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.span
              animate={{
                scale: isInView ? 0 : 1,
              }}
              transition={{ duration: 0.1179, delay: 1.4999, ease: "linear" }}
              className="origin-bottom-right lg:origin-bottom-right absolute inset-0 z-1 rounded-bl-full lg:rounded-bl-none lg:rounded-tl-full inline-block border-b border-l lg:border-t lg:border-b-0 border-dark-1/50 size-full"
            />
          </motion.span>
          <motion.span
            className={cn(
              "relative outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "row-start-4 col-start-2 row-end-5 col-end-4",
              "lg:row-start-2 lg:col-start-2 lg:row-end-4 lg:col-end-3"
            )}
          >
            <motion.span
              className="absolute inset-0 bg-dark-2 size-full"
              animate={{
                opacity: isInView ? 0 : 1,
              }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.span
              animate={{
                scale: isInView ? 0 : 1,
              }}
              transition={{ duration: 0.0726, delay: 1.6178, ease: "linear" }}
              className="origin-top-right lg:origin-top-right absolute inset-0 z-1 rounded-br-full lg:rounded-br-none lg:rounded-bl-full inline-block border-b border-r lg:border-r-0 lg:border-l border-dark-1/50 size-full"
            />
          </motion.span>
          <motion.span
            className={cn(
              "relative outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "row-start-2 col-start-3 row-end-4 col-end-4",
              "lg:row-start-3 lg:col-start-3 lg:row-end-4 lg:col-end-5"
            )}
          >
            <motion.span
              className="absolute inset-0 bg-dark-2 size-full"
              animate={{
                opacity: isInView ? 0 : 1,
              }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.span
              animate={{
                scale: isInView ? 0 : 1,
              }}
              transition={{ duration: 0.0448, delay: 1.6906, ease: "linear" }}
              className="origin-top-left lg:origin-top-left absolute inset-0 z-1 rounded-tr-full lg:rounded-tr-none lg:rounded-br-full inline-block border-t border-r lg:border-b lg:border-t-0 border-dark-1/50 size-full"
            />
          </motion.span>
          <motion.span
            className={cn(
              "relative outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "row-start-2 col-start-2 row-end-3 col-end-3",
              "lg:row-start-2 lg:col-start-4 lg:row-end-3 lg:col-end-5"
            )}
          >
            <motion.span
              className="absolute inset-0 bg-dark-2 size-full"
              animate={{
                opacity: isInView ? 0 : 1,
              }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.span
              animate={{
                scale: isInView ? 0 : 1,
              }}
              transition={{ duration: 0.0276, delay: 1.7354, ease: "linear" }}
              className="origin-bottom-left lg:origin-bottom-left absolute inset-0 z-1 rounded-tl-full lg:rounded-tl-none lg:rounded-tr-full inline-block border-t border-l lg:border-l-0 lg:border-r border-dark-1/50 size-full"
            />
          </motion.span>
          <motion.span
            className={cn(
              "relative outline outline-dashed transition-[outline]",
              isInView ? "outline-dark-1/10" : "outline-dark-1/25",
              "row-start-3 col-start-2 row-end-4 col-end-3",
              "lg:row-start-2 lg:col-start-3 lg:row-end-3 lg:col-end-4"
            )}
          >
            <motion.span
              className="absolute inset-0 bg-dark-2 size-full"
              animate={{
                opacity: isInView ? 0 : 1,
              }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.span
              animate={{
                scale: isInView ? 0 : 1,
              }}
              transition={{ duration: 0.017, delay: 1.763, ease: "linear" }}
              className="origin-bottom-right lg:origin-bottom-right absolute inset-0 z-1 rounded-bl-full lg:rounded-bl-none lg:rounded-tl-full inline-block border-b border-l lg:border-t lg:border-b-0 border-dark-1/50 size-full"
            />
          </motion.span>
        </div>

        <div className="grid col-span-full row-span-full grid-cols-subgrid grid-rows-subgrid">
          <AnimatePresence mode="popLayout">
            {windowWidth >= 1024 && isInView && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: "easeIn", duration: 0.5, delay: 1 }}
                className={cn(
                  "grid grid-cols-[repeat(3,8rem)] grid-rows-2 place-self-center gap-8 h-8/10",
                  "lg:row-start-1 lg:col-start-1 lg:row-end-5 lg:col-end-2"
                )}
              >
                <SedimentaryGrooveP5 className="row-start-1 col-start-1 row-end-2 col-end-2 size-full outline outline-light-2/80 shadow-2xl [corner-shape:squircle] rounded-4xl overflow-hidden" />
                <SedimentaryGrooveP5 className="row-start-2 col-start-1 row-end-3 col-end-2 size-full outline outline-light-2/80 shadow-2xl [corner-shape:squircle] rounded-4xl overflow-hidden" />
                <SedimentaryGrooveP5 className="row-start-1 col-start-2 row-end-3 col-end-3 size-full outline outline-light-2/80 shadow-2xl [corner-shape:squircle] rounded-4xl overflow-hidden" />
                <SedimentaryGrooveP5 className="row-start-1 col-start-3 row-end-2 col-end-4 size-full outline outline-light-2/80 shadow-2xl [corner-shape:squircle] rounded-4xl overflow-hidden" />
                <SedimentaryGrooveP5 className="row-start-2 col-start-3 row-end-3 col-end-4 size-full outline outline-light-2/80 shadow-2xl [corner-shape:squircle] rounded-4xl overflow-hidden" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="row-start-1 col-start-1 row-end-2 col-end-5 lg:row-start-1 lg:col-start-2 lg:row-end-2 lg:col-end-6 flex items-center justify-center p-4">
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
