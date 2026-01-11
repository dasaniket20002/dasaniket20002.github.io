import { motion, useMotionValue, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";
import { cn } from "../../utils";

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
        onMouseEnter={() =>
          color.set(
            "color-mix(in oklch, var(--color-light-2) 80%, transparent)"
          )
        }
        onMouseLeave={() => color.set("var(--color-dark-1)")}
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

export default ExperienceItem;
