import { TextEffect } from "../../components/text-effect";
import { cn } from "../../utils";

export default function HeroTagLine({ className }: { className?: string }) {
  return (
    <div className={cn("relative uppercase text-dark-d space-y-2", className)}>
      <TextEffect
        per="line"
        as="h1"
        delay={1}
        speedReveal={2}
        className="text-4xl tracking-tight leading-relaxed font-normal font-width-125 py-px"
        tokenStyles={[
          {
            match: "hi! I'm",
            className: "text-2xl",
          },
          {
            match: "Aniket Das",
            className: "text-3xl",
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
        className="text-4xl tracking-tight leading-relaxed font-normal font-width-125 py-px"
        tokenStyles={[
          {
            match: "digital experiences",
            className: "text-5xl font-semibold italic",
          },
          {
            match: "motion",
            className: "text-5xl font-semibold italic",
          },
          {
            match: "graphics",
            className: "text-5xl font-semibold italic",
          },
        ]}
      >
        {`I build digital experiences\nwith motion & graphics.`}
      </TextEffect>
    </div>
  );
}
