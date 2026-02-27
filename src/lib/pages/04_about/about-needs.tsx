import {
  useInView,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef } from "react";
import { TextEffect } from "../../components/text-effect";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { useElementSize } from "../../hooks/use-element-size";
import { useWindowSize } from "../../hooks/use-window-size";
import { cn } from "../../utils";

const ABOUT_NEEDS_CONTENT = [
  {
    cat: "Impact over tickets",
    desc: "I want to build products that move metrics, not just close Jira cards. I'm looking for teams where frontend decisions are tied to user outcomes, performance, and real business impact - not just feature velocity.",
  },
  {
    cat: "Real collaboration",
    desc: "Cross-functional teams where engineers, designers, and product work as partners. I value shared ownership, thoughtful technical discussions, and shipping as a team - not siloed handoffs.",
  },
  {
    cat: "Engineering quality",
    desc: "Teams that care about architecture, performance, and maintainability. Clean component systems, thoughtful state management, meaningful code reviews, and time allocated for refactoring when it matters.",
  },
  {
    cat: "Complex product challenges",
    desc: "I enjoy solving hard UI problems - scalable design systems, performance-heavy interfaces, real-time systems, data-dense dashboards, or immersive 3D experiences. The more nuanced the problem, the better.",
  },
  {
    cat: "Room to grow technically",
    desc: "Environments that encourage experimentation and continuous learning. Whether it's advanced React patterns, performance optimization, 3D on the web, animation systems, or emerging AI integrations - I want to keep leveling up.",
  },
  {
    cat: "Human-first culture",
    desc: "Teams that value clarity, feedback, and respect. High standards, low ego. Psychological safety and strong communication matter as much as technical skill.",
  },
];

export default function AboutNeeds({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealHeaderRef = useRef<HTMLDivElement>(null);
  const aboutContainerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();
  const { width: windowWidth } = useWindowSize();
  const { height: aboutContainerHeight } = useElementSize(aboutContainerRef);

  const aboutContentInView = useInView(aboutContainerRef, {
    margin: "-128px",
  });

  const { scrollYProgress: revealProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 0.75"],
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["-0.25 end", "end start"],
  });

  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"],
  });

  const titleRevealY = useTransform(revealProgress, [0, 1], ["100%", "0%"]);

  const _revealBlur = useTransform(revealProgress, [0, 1], [3, 0]);
  const _exitBlur = useTransform(exitProgress, [0.8, 1], [0, 3]);
  const _titleBlur = useTransform([_revealBlur, _exitBlur], ([reveal, exit]) =>
    Math.max(reveal as number, exit as number),
  );
  const titleRevealBlur = useMotionTemplate`blur(${_titleBlur}px)`;

  const titleParallaxTop = useTransform(
    scrollYProgress,
    [0, 1],
    ["100%", "0%"],
  );

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  return (
    <div
      ref={containerRef}
      id="about"
      className={cn(
        "relative grid gap-y-12 md:gap-y-0 py-16 h-dvh",
        "grid-cols-[4rem_1fr_4rem] grid-rows-[auto_1fr]",
        "md:grid-cols-[8rem_1fr_1fr_1fr_8rem]",
        className,
      )}
    >
      <div
        ref={revealHeaderRef}
        className="sticky top-16 md:relative md:top-0 row-[1/2] md:row-[1/3] col-[2/-2] md:col-[2/3] w-full z-1"
        style={{
          height: windowWidth >= 768 ? aboutContainerHeight : "auto",
        }}
      >
        <m.div
          style={{ top: windowWidth >= 768 ? titleParallaxTop : 0 }}
          className="sticky flex flex-col"
        >
          <div className="mask-b-from-80%">
            <m.h3
              style={{ y: titleRevealY, filter: titleRevealBlur }}
              className="text-4xl font-width-125 font-light tracking-wide uppercase"
            >
              what i'm looking for
            </m.h3>
          </div>
          <div className="mask-b-from-80%">
            <m.p
              style={{ y: titleRevealY, filter: titleRevealBlur }}
              className="text-xl font-width-120 font-extralight tracking-wide uppercase"
            >
              for salvation
            </m.p>
          </div>
        </m.div>
      </div>
      <div
        ref={aboutContainerRef}
        className="row-[2/3] md:row-[1/3] col-[2/-2] md:col-[3/5] h-full max-w-5xl grid auto-rows-fr grid-cols-[auto_1fr] gap-x-8 gap-y-4"
      >
        <span className="col-span-full text-5xl font-light font-width-120 text-light-d flex gap-[0.5ch]">
          <TextEffect
            as="h1"
            trigger={aboutContentInView}
            preset="default"
            per="char"
            speedReveal={2}
          >
            The right
          </TextEffect>
          <TextEffect
            as="h1"
            trigger={aboutContentInView}
            preset="default"
            per="char"
            speedReveal={2}
            delay={0.25}
            className="text-light-l italic"
          >
            fit
          </TextEffect>
          <TextEffect
            as="h1"
            trigger={aboutContentInView}
            preset="default"
            per="char"
            speedReveal={2}
            delay={0.5}
          >
            matters
          </TextEffect>
        </span>
        {ABOUT_NEEDS_CONTENT.map((content, i) => (
          <AboutNeedContent
            key={i}
            cat={content.cat}
            desc={content.desc}
            i={i}
          />
        ))}
      </div>
    </div>
  );
}

function AboutNeedContent({
  cat,
  desc,
  className,
  i,
}: {
  cat: string;
  desc: string;
  className?: string;
  i: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-128px" });
  return (
    <div
      ref={containerRef}
      className={cn("col-span-full grid grid-cols-subgrid", className)}
    >
      <TextEffect
        as="p"
        trigger={isInView}
        preset="default"
        per="word"
        speedReveal={2}
        delay={i * 0.1}
        className={cn(
          "text-sm font-light font-width-100 tracking-wide leading-snug h-full py-2 text-light-d border-b border-dark-l/25 uppercase",
          i === 0 && "border-t",
        )}
      >
        {cat}
      </TextEffect>
      <TextEffect
        as="p"
        trigger={isInView}
        preset="default"
        per="line"
        speedReveal={2}
        delay={0.25 + i * 0.1}
        className={cn(
          "text-lg font-light font-width-100 tracking-wide leading-snug h-full py-2 border-b border-dark-l/25",
          i === 0 && "border-t",
        )}
      >
        {desc}
      </TextEffect>
    </div>
  );
}
