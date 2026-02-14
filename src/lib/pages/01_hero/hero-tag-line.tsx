import { TextEffect } from "../../components/text-effect";
import { cn } from "../../utils";

export default function HeroTagLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative px-6 py-4 uppercase text-dark-1 space-y-8",
        className,
      )}
    >
      <TextEffect
        per="line"
        as="h1"
        delay={0.8}
        speedSegment={0.5}
        className="text-4xl tracking-tight leading-relaxed font-normal font-width-125 py-px [text-shadow:0px_0px_2px_var(--tw-text-shadow-color)] text-shadow-light-1"
        tokenStyles={[
          { match: "clients", className: "text-5xl font-semibold italic" },
          {
            match: "compelling visuals",
            className: "text-5xl font-semibold italic",
          },
          { match: "connection", className: "text-5xl font-semibold italic" },
          { match: "business", className: "text-5xl font-semibold italic" },
        ]}
      >
        {`I engage clients through\n compelling visuals  that builds a\nstronger connection with\nthe business.`}
      </TextEffect>
    </div>
  );
}
