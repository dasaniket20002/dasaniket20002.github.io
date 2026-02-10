import {
  MotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useMemo } from "react";
import { cn } from "../utils";

const getHighlightIndices = (text: string, words?: string[]) => {
  const indices = new Set<number>();

  words?.forEach((word) => {
    const regex = new RegExp(word, "g");
    let match;
    // Find all occurrences of the word in the text
    while ((match = regex.exec(text)) !== null) {
      // Add every index of that word to the Set
      for (let i = 0; i < word.length; i++) {
        indices.add(match.index + i);
      }
    }
  });

  return indices;
};

const Char = ({
  children,
  index,
  progress,
  isHighlighted,
}: {
  children: string;
  index: number;
  progress: MotionValue<number>;
  isHighlighted: boolean;
}) => {
  const opacity = useTransform(progress, [index, index + 1], [0.25, 1]);
  const blur = useTransform(progress, [index, index + 1], ["1px", "0px"]);
  const filter = useMotionTemplate`blur(${blur})`;

  const wdth = useTransform(progress, [index, index + 1], [85, 125]);
  const ytlc = useTransform(progress, [index, index + 1], [440, 540]);
  const wght = useTransform(progress, [index, index + 1], [300, 800]);
  const ital = useTransform(progress, [index, index + 1], [0, 1]);

  const fontVariationSettings = useMotionTemplate`'wdth' ${wdth}, 'YTLC' ${ytlc}, 'wght' ${wght}, 'ital' ${ital}`;

  return (
    <m.span
      style={{ opacity, filter, fontVariationSettings }}
      className={cn(isHighlighted && "text-light-2")}
    >
      {children}
    </m.span>
  );
};

export type ScrollRevealTextProps = {
  displayText: string;
  highlights?: string[];
  containerRef: React.RefObject<HTMLElement | null>;
} & HTMLMotionProps<"div">;

const ScrollRevealText = forwardRef<HTMLDivElement, ScrollRevealTextProps>(
  (
    { displayText, highlights, containerRef, className, ...motionProps },
    ref,
  ) => {
    const displaySplit = useMemo(() => displayText.split(""), [displayText]);
    const highlightIndices = useMemo(
      () => getHighlightIndices(displayText, highlights),
      [displayText, highlights],
    );

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end end"],
    });

    const calculatedIndex = useTransform(
      scrollYProgress,
      [0, 1],
      [0, displaySplit.length],
    );
    const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
      <m.div
        ref={ref}
        className={cn("sticky top-0 h-full flex gap-6", className)}
        {...motionProps}
      >
        <m.div
          className="w-px h-full bg-light-2 mask-t-from-0% mask-b-from-0%"
          style={{ height: progress }}
        />
        <p className="relative text-7xl text-dark-1 whitespace-pre-wrap tracking-tighter leading-tight">
          {displaySplit.map((char, index) => (
            <Char
              key={index}
              index={index}
              progress={calculatedIndex}
              isHighlighted={highlightIndices.has(index)}
            >
              {char}
            </Char>
          ))}
        </p>
      </m.div>
    );
  },
);

export default ScrollRevealText;
