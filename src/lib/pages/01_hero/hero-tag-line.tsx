import { TextEffect } from "../../components/text-effect";
import { cn } from "../../utils";

export default function HeroTagLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative pl-6 pt-4 uppercase tracking-tight font-light text-[max(1.618rem,1.618vw)] text-dark-1 -space-y-2",
        className,
      )}
    >
      <TextEffect
        per="word"
        as="h1"
        delay={0.5}
        className="overflow-hidden pb-1"
      >
        I bridge the gap between
      </TextEffect>
      <TextEffect
        per="word"
        as="h1"
        delay={0.725}
        className="overflow-hidden italic font-normal text-[max(2.427rem,2.427vw)] tracking-normal"
      >
        technical architecture
      </TextEffect>
      <span className="flex gap-[1ch] overflow-hidden items-end">
        <TextEffect per="word" as="h1" delay={0.8} className="mb-1.5">
          and
        </TextEffect>
        <TextEffect
          per="word"
          as="h1"
          delay={0.85}
          className="italic font-normal text-[max(2.427rem,2.427vw)] tracking-normal"
        >
          visual storytelling.
        </TextEffect>
      </span>
    </div>
  );
}
