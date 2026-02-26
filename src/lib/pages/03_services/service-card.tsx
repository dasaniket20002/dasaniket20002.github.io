import { useInView } from "motion/react";
import { TextEffect } from "../../components/text-effect";
import { useRef } from "react";
import { cn } from "../../utils";

export default function ServiceCard({
  title,
  items,
  description,
  className,
}: {
  title: string;
  items: string[];
  description: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    // once: true,
    margin: "128px 0px -128px 0px",
  });

  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4 border-b border-light-d", className)}
    >
      <div className="flex gap-8 justify-between">
        <TextEffect
          as="h1"
          trigger={isInView}
          preset="default"
          per="char"
          speedReveal={2}
          className="text-5xl font-extralight font-width-120 uppercase"
        >
          {title}
        </TextEffect>

        <div className="text-lg font-medium tracking-wide text-end">
          {items.map((item, i) => (
            <TextEffect
              key={i}
              as="p"
              trigger={isInView}
              preset="fade"
              per="word"
              delay={0.15 + i * 0.08}
              className="whitespace-nowrap"
            >
              {`${item} /`}
            </TextEffect>
          ))}
        </div>
      </div>

      <TextEffect
        as="p"
        trigger={isInView}
        preset="fade"
        per="line"
        delay={0.3}
        className="font-light tracking-wider text-light-d text-justify"
      >
        {description}
      </TextEffect>
    </div>
  );
}
