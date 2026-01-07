import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useMemo, useRef } from "react";
import Cubes from "../../components/cubes";
import HorizontalDivider from "../../components/horizontal-divider";
import { useElementSize } from "../../hooks/use-element-size";
import { cn } from "../../utils";
import ExperienceItem from "./experience-item";

const Experience = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  const cubesContainerRef = useRef<HTMLDivElement>(null);
  const cubesContainerSize = useElementSize(cubesContainerRef);
  const cubeSize = useMemo(
    () => Math.min(cubesContainerSize.width, cubesContainerSize.height) * 0.2,
    [cubesContainerSize]
  );
  const cellGap = useMemo(() => cubeSize / 2, [cubeSize]);

  return (
    <motion.section
      className={cn(
        "bg-dark-2 min-h-[calc(100vh-var(--head-height))] px-8 md:px-32 flex flex-col gap-8",
        className
      )}
      {...motionProps}
      ref={ref}
    >
      <h2 className="col-span-full text-4xl md:text-[min(5vw,4.5rem)] font-think-loved text-light-2 trim-text-caps py-8 text-center flex-none">
        {["E", "X", "P", "E", "RI", "E", "N", "C", "E"].map((it, i) => (
          <motion.span
            initial={{ scale: 1.5, width: 0, opacity: 0 }}
            whileInView={{ scale: 1, width: "auto", opacity: 1 }}
            transition={{ ease: "backOut", delay: i * 0.02 }}
            viewport={{ once: true, margin: "0% 0% -30% 0%" }}
            key={i}
            className="inline-block"
          >
            {it}
          </motion.span>
        ))}
      </h2>

      <div className="w-full flex gap-32 items-center justify-center">
        <motion.section
          initial={{ scale: 1.05, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.25, duration: 1 }}
          viewport={{ once: true, margin: "0% 0% -30% 0%" }}
          className="h-[20vh] lg:h-[40vh] lg:py-12"
        >
          <img
            src="assets/illustrations/undraw_work-together_0f8c.svg"
            alt="work together illustration"
            className="size-full aspect-auto"
          />
        </motion.section>
        {/* <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.25, duration: 1 }}
          viewport={{ once: true, margin: "0% 0% -30% 0%" }}
          className="h-[20vh] lg:h-[40vh] lg:py-12 aspect-square"
        >
          <ExperienceSVG className="size-full fill-light-2" />
        </motion.div> */}

        <section className="py-12 grid grid-cols-[1fr_5fr_3fr] auto-rows-min gap-x-4 gap-y-3 self-center flex-1">
          <HorizontalDivider
            className="mx-4 col-span-full"
            initial={{ clipPath: "inset(0% 50% 0% 50%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ ease: "backOut", delay: 0.5, duration: 1 }}
            viewport={{ once: true, margin: "0% 0% -30% 0%" }}
          />

          <ExperienceItem
            url={"assets/logos/JMAN Group.png"}
            alt={"JMAN Group"}
            title={"Software Engineer"}
            company={"JMAN Group Pvt.Ltd."}
            location={"Chennai, India (On-Site)"}
            period={"Jul/2024 - Sep/2025"}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ ease: "backOut", delay: 0.25, duration: 0.5 }}
            viewport={{ once: true, margin: "0% 0% -30% 0%" }}
            // drag
            // dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
          />

          <HorizontalDivider
            className="mx-4 col-span-full"
            initial={{ clipPath: "inset(0% 50% 0% 50%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ ease: "backOut", delay: 0.5, duration: 1 }}
            viewport={{ once: true, margin: "0% 0% -30% 0%" }}
          />

          <ExperienceItem
            imgClassName="p-4"
            url={"assets/logos/IDZ Digital.png"}
            alt={"IDZ Digital"}
            title={"Game Developer"}
            company={"IDZ Digital Pvt.Ltd."}
            location={"Mumbai, India (Remote)"}
            period={"Jun/2023 - Oct/2023"}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ ease: "backOut", delay: 0.25, duration: 0.5 }}
            viewport={{ once: true, margin: "0% 0% -30% 0%" }}
            // drag
            // dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
          />

          <HorizontalDivider
            className="mx-4 col-span-full"
            initial={{ clipPath: "inset(0% 50% 0% 50%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ ease: "backOut", delay: 0.5, duration: 1 }}
            viewport={{ once: true, margin: "0% 0% -30% 0%" }}
          />
        </section>
      </div>

      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ ease: "backOut", delay: 0.25, duration: 1 }}
        viewport={{ once: true, margin: "0% 0% -20% 0%" }}
        ref={cubesContainerRef}
        className="relative flex-1"
      >
        {cubesContainerSize.height >= 128 && (
          <Cubes
            layout="responsive"
            parentContainerRef={cubesContainerRef}
            cubeSize={cubeSize}
            cellGap={cellGap}
            className="size-full"
            shadow
          />
        )}
      </motion.div>
    </motion.section>
  );
});

export default Experience;
