import { useInView } from "motion/react";
import { TextEffect } from "../../components/text-effect";
import { useRef } from "react";

export default function ServiceCard({
  title,
  items,
  description,
}: {
  title: string;
  items: string[];
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    // once: true,
    margin: "128px 0px -128px 0px",
  });

  return (
    <div ref={ref} className="flex flex-col gap-3 max-w-4xl">
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
