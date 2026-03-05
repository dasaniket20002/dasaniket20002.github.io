import { TextEffect } from "../../components/ui/text-effect";
import { cn } from "../../utils";

export default function HeroTagLine({ className }: { className?: string }) {
  return (
    <div className={cn("relative uppercase text-dark-d space-y-2", className)}>
      <TextEffect
        per="line"
        as="h1"
        delay={1}
        speedReveal={2}
        className="text-3xl leading-relaxed font-light py-px"
        tokenStyles={[
          {
            match: "Aniket Das",
            className: "text-4xl",
          },
        ]}
      >
        {`hi! I'm Aniket Das.`}
      </TextEffect>

      <TextEffect
        per="line"
        as="h1"
        delay={1}
        speedReveal={2}
        className="text-5xl leading-relaxed font-light py-px"
        tokenStyles={[
          {
            match: "digital experiences",
            className: "text-6xl font-extralight font-width-110",
          },
          {
            match: "motion",
            className: "text-6xl font-extralight font-width-110",
          },
          {
            match: "graphics",
            className: "text-6xl font-extralight font-width-110",
          },
        ]}
      >
        {`I build digital experiences\nwith motion & graphics.`}
      </TextEffect>
    </div>
  );
}
