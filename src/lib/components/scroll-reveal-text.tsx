import {
  motion,
  MotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
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

  return (
    <motion.span
      style={{ opacity, filter }}
      className={cn(isHighlighted && "text-light-2")}
    >
      {children}
    </motion.span>
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
    return (
      <motion.div
        ref={ref}
        className={cn("sticky top-0", className)}
        {...motionProps}
      >
        <p className="relative font-think-loved text-7xl text-dark-1 whitespace-pre-wrap">
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
      </motion.div>
    );
  },
);

export default ScrollRevealText;
