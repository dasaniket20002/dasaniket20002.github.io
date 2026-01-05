import { motion, useMotionValue, type HTMLMotionProps } from "motion/react";
import { forwardRef, useLayoutEffect, useRef } from "react";
import HorizontalDivider from "../components/horizontal-divider";
import { useElementSize } from "../hooks/use-element-size";
import { useStickySnap } from "../hooks/use-sticky-snap";
import { cn } from "../utils";

export default function Work({ className }: { className?: string }) {
  const headRef = useRef<HTMLDivElement>(null);
  const { height: headHeight } = useElementSize(headRef);

  const section1 = useRef<HTMLElement>(null);
  const section2 = useRef<HTMLElement>(null);
  const { registerSection } = useStickySnap();
  useLayoutEffect(() => {
    if (!headHeight) return;

    if (section1.current)
      registerSection(section1.current, { offset: headHeight });
    if (section2.current)
      registerSection(section2.current, { offset: headHeight });
  }, [registerSection, headHeight]);

  return (
    <div
      id="work"
      className={cn("min-h-screen w-full relative", className)}
      style={{ "--head-height": `${headHeight}px` } as React.CSSProperties}
    >
      <section
        ref={headRef}
        data-bg-theme="light"
        className="bg-light-1 flex justify-between items-end px-4 md:px-16 font-think-loved sticky top-0 pt-page z-9997"
      >
        <h2 className="text-light-2 text-xl md:text-[min(3vw,2.5rem)] trim-text-caps">
          dg/01
        </h2>
        <h1 className="text-dark-2 text-5xl md:text-[min(7vw,6rem)] trim-text-caps">
          work
        </h1>
      </section>

      <Experience ref={section1} />

      <section
        className="bg-dark-2 h-[calc(100vh-var(--head-height))]"
        ref={section2}
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease: "backOut", delay: 0.1 }}
          viewport={{ once: true, margin: "0px 0px -30% 0px" }}
          className="text-center text-8xl font-think-loved text-light-2"
        >
          Please Hold on!
        </motion.p>
      </section>
    </div>
  );
}

const ExperienceItem = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    imgClassName?: string;
    url: string;
    alt: string;
    title: string;
    company: string;
    location: string;
    period: string;
  } & HTMLMotionProps<"div">
>(
  (
    {
      className,
      imgClassName,
      url,
      alt,
      title,
      company,
      location,
      period,
      ...motionProps
    },
    ref
  ) => {
    const color = useMotionValue("var(--color-dark-1)");
    return (
      <motion.div
        ref={ref}
        {...motionProps}
        className={cn(
          "grid grid-cols-subgrid col-span-full size-min p-4 rounded-lg hover:bg-dark-1/10 cursor-pointer",
          className
        )}
        whileHover={{
          scale: 1.02,
          transition: { delay: 0, ease: "anticipate" },
        }}
        onHoverStart={() =>
          color.set(
            "color-mix(in oklch, var(--color-light-2) 80%, transparent)"
          )
        }
        onHoverEnd={() => color.set("var(--color-dark-1)")}
      >
        <motion.div
          className={cn(
            "size-16 p-2 rounded flex items-center justify-center transition-colors delay-100",
            imgClassName
          )}
          style={{ backgroundColor: color }}
        >
          <img src={url} alt={alt} className="w-full" />
        </motion.div>
        <section className="-space-y-1 place-content-center col-span-2 md:col-span-1 tracking-wide">
          <h3 className="font-think-loved text-xl md:text-2xl text-light-2">
            {title}
          </h3>
          <motion.p style={{ color }} className="transition-colors delay-100">
            {company}
          </motion.p>
        </section>
        <motion.section
          style={{ color }}
          className="italic font-light place-content-center col-span-full md:col-span-1 transition-colors delay-100 tracking-wider"
        >
          <p className="text-xs text-end">{location}</p>
          <p className="text-end">{period}</p>
        </motion.section>
      </motion.div>
    );
  }
);

const Experience = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  return (
    <motion.section
      className={cn(
        "bg-dark-2 min-h-[calc(100vh-var(--head-height))] px-8 md:px-32 grid lg:grid-cols-[1fr_2fr] auto-rows-[minmax(min-content,max-content)] gap-x-32 gap-y-8",
        className
      )}
      {...motionProps}
      ref={ref}
    >
      <h2 className="col-span-full text-4xl md:text-[min(5vw,4.5rem)] font-think-loved text-light-2 trim-text-caps py-8 text-center">
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

      <section className="py-12 grid grid-cols-[1fr_5fr_3fr] auto-rows-min gap-x-4 gap-y-3 self-center">
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
          drag
          dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
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
          drag
          dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <HorizontalDivider
          className="mx-4 col-span-full"
          initial={{ clipPath: "inset(0% 50% 0% 50%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ ease: "backOut", delay: 0.5, duration: 1 }}
          viewport={{ once: true, margin: "0% 0% -30% 0%" }}
        />
      </section>
    </motion.section>
  );
});
