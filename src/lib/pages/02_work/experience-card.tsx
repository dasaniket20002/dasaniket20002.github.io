import { IconPencil } from "@tabler/icons-react";
import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { TextEffect } from "../../components/text-effect";
import { cn } from "../../utils";
import type { Experience } from "./experience-list";

export default function ExperienceCard({
  experience,
}: {
  experience: Experience;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "128px 0px -128px 0px" });
  const showTimeline = experience.designations.length > 1;

  return (
    <div ref={ref} className="flex gap-8 items-start">
      {/* Logo */}
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
        }
        transition={{ duration: 0.4 }}
        className="size-24 shrink-0 bg-light-d rounded-2xl p-3 grid place-items-center"
      >
        <img src={experience.imgUrl} alt={experience.companyName} />
      </m.div>

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0">
        <TextEffect
          as="h3"
          preset="default"
          trigger={isInView}
          per="char"
          speedReveal={2}
          className="text-4xl font-width-120 font-extralight uppercase"
        >
          {experience.companyName}
        </TextEffect>

        <TextEffect
          as="p"
          trigger={isInView}
          preset="fade"
          per="word"
          delay={0.1}
          className="text-base text-light-l/75 tracking-wider"
        >
          {`${experience.location} · ${experience.totalDuration}`}
        </TextEffect>

        {/* Designations */}
        <div className="flex flex-col mt-3">
          {experience.designations.map((des, i) => (
            <div
              key={i}
              className={cn(
                "relative pb-6 last:pb-0 pl-6",
                showTimeline && "border-l-2 border-light-d/25",
              )}
            >
              {/* Timeline dot */}
              <span className="absolute -left-2.25 top-2 size-4 rounded-full bg-light-d border-3 border-dark-d" />

              {/* Title + type */}
              <TextEffect
                as="p"
                trigger={isInView}
                preset="fade"
                per="word"
                delay={0.15 + i * 0.1}
                className="text-2xl font-width-120 font-light tracking-wide uppercase"
              >
                {`${des.title} · ${des.type}`}
              </TextEffect>

              {/* Date range */}
              <TextEffect
                as="p"
                trigger={isInView}
                preset="fade"
                per="word"
                delay={0.2 + i * 0.1}
                className="text-base text-light-l/75 tracking-wider"
              >
                {`${des.startDate} - ${des.endDate} · ${des.duration}`}
              </TextEffect>

              {/* Descriptions – fade in as a single block */}
              <m.ul
                initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                animate={{
                  clipPath: isInView
                    ? "inset(0% 0% 0% 0%)"
                    : "inset(0% 0% 100% 0%)",
                }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="mt-2 space-y-1 tracking-widest font-light text-light-d list-['-_'] pl-4"
              >
                {des.descriptions.map((desc, j) => (
                  <li key={j}>{desc}</li>
                ))}
              </m.ul>

              {/* Skills */}
              {des.skills && des.skills.length > 0 && (
                <m.p
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 mt-2 text-light-l/75 text-lg"
                >
                  <IconPencil className="size-5 stroke-1 shrink-0" />
                  {des.skills.join(", ")}
                </m.p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
