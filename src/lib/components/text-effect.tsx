"use client";
import type {
  TargetAndTransition,
  Transition,
  Variant,
  Variants,
} from "motion/react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import React, { useMemo } from "react";
import { cn } from "../utils";

export type PresetType =
  | "blur"
  | "fade-in-blur"
  | "scale"
  | "fade"
  | "slide"
  | "default";

export type PerType = "word" | "char" | "line";

export type TextEffectVariant = {
  container?: Variants;
  item?: Variants;
};

export type TokenStyle = {
  match: string;
  className?: string;
  style?: React.CSSProperties;
};

export type TextEffectProps = {
  children: string;
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements;
  variants?: TextEffectVariant;
  className?: string;
  preset?: PresetType;
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  style?: React.CSSProperties;
  tokenStyles?: TokenStyle[];
};

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      ease: "easeInOut",
    },
  },
  exit: { opacity: 0 },
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(12px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(12px)" },
    },
  },
  "fade-in-blur": {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
      visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      exit: { opacity: 0, y: 20, filter: "blur(12px)" },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
  default: {
    container: defaultContainerVariants,
    item: {
      hidden: {
        y: 12,
        clipPath: "inset(0% 0% 100% 0%)",
      },
      visible: {
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
      },
      exit: {
        y: 12,
        clipPath: "inset(0% 0% 100% 0%)",
      },
    },
  },
};

// ── Token styling helpers ──────────────────────────────────────────────

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * For `per="line"` – parse the full line string and wrap matched
 * substrings in styled <span>s.  Longer matches are prioritised.
 */
function renderStyledText(
  text: string,
  tokenStyles?: TokenStyle[],
): React.ReactNode {
  if (!tokenStyles || tokenStyles.length === 0) return text;

  const sorted = [...tokenStyles].sort(
    (a, b) => b.match.length - a.match.length,
  );

  const pattern = sorted.map((t) => escapeRegExp(t.match)).join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const token = sorted.find(
      (t) => t.match.toLowerCase() === part.toLowerCase(),
    );
    if (token) {
      return (
        <span key={i} className={token.className} style={token.style}>
          {part}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/**
 * For `per="word"` / `per="char"` – build a map from every individual
 * word inside every `match` string to its TokenStyle so that multi-word
 * matches like "compelling visuals" resolve for each word independently.
 */
function buildWordStyleMap(
  tokenStyles?: TokenStyle[],
): Map<string, TokenStyle> | undefined {
  if (!tokenStyles || tokenStyles.length === 0) return undefined;

  const map = new Map<string, TokenStyle>();
  for (const token of tokenStyles) {
    for (const word of token.match.split(/\s+/)) {
      if (word) map.set(word.toLowerCase(), token);
    }
  }
  return map;
}

function lookupWordStyle(
  word: string,
  map?: Map<string, TokenStyle>,
): TokenStyle | undefined {
  if (!map) return undefined;
  return map.get(word.trim().toLowerCase());
}

// ── AnimationComponent ─────────────────────────────────────────────────

const AnimationComponent: React.FC<{
  segment: string;
  variants: Variants;
  per: PerType;
  segmentWrapperClassName?: string;
  tokenStyles?: TokenStyle[];
  wordStyleMap?: Map<string, TokenStyle>;
}> = React.memo(
  ({
    segment,
    variants,
    per,
    segmentWrapperClassName,
    tokenStyles,
    wordStyleMap,
  }) => {
    const matched =
      per !== "line" ? lookupWordStyle(segment, wordStyleMap) : undefined;

    const content =
      per === "line" ? (
        <m.span variants={variants} className="block">
          {renderStyledText(segment, tokenStyles)}
        </m.span>
      ) : per === "word" ? (
        <m.span
          aria-hidden="true"
          variants={variants}
          className={cn("inline-block whitespace-pre", matched?.className)}
          style={matched?.style}
        >
          {segment}
        </m.span>
      ) : (
        <m.span className="inline-block whitespace-pre">
          {segment.split("").map((char, charIndex) => (
            <m.span
              key={`char-${charIndex}`}
              aria-hidden="true"
              variants={variants}
              className={cn("inline-block whitespace-pre", matched?.className)}
              style={matched?.style}
            >
              {char}
            </m.span>
          ))}
        </m.span>
      );

    if (!segmentWrapperClassName) return content;

    const defaultWrapperClassName = per === "line" ? "block" : "inline-block";

    return (
      <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
        {content}
      </span>
    );
  },
);

AnimationComponent.displayName = "AnimationComponent";

// ── Utilities ──────────────────────────────────────────────────────────

const splitText = (text: string, per: PerType) => {
  if (per === "line") return text.split("\n");
  return text.split(/(\s+)/);
};

const hasTransition = (
  variant?: Variant,
): variant is TargetAndTransition & { transition?: Transition } => {
  if (!variant) return false;
  return typeof variant === "object" && "transition" in variant;
};

const createVariantsWithTransition = (
  baseVariants: Variants,
  transition?: Transition & { exit?: Transition },
): Variants => {
  if (!transition) return baseVariants;

  const { exit: _, ...mainTransition } = transition;

  return {
    ...baseVariants,
    visible: {
      ...baseVariants.visible,
      transition: {
        ...(hasTransition(baseVariants.visible)
          ? baseVariants.visible.transition
          : {}),
        ...mainTransition,
      },
    },
    exit: {
      ...baseVariants.exit,
      transition: {
        ...(hasTransition(baseVariants.exit)
          ? baseVariants.exit.transition
          : {}),
        ...mainTransition,
        staggerDirection: -1,
      },
    },
  };
};

// ── TextEffect ─────────────────────────────────────────────────────────

export function TextEffect({
  children,
  per = "word",
  as = "p",
  variants,
  className,
  preset = "default",
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
  tokenStyles,
}: TextEffectProps) {
  const segments = splitText(children, per);
  const MotionTag = m[as as keyof typeof m] as typeof m.div;

  const baseVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };

  const stagger = defaultStaggerTimes[per] / speedReveal;
  const baseDuration = 0.3 / speedSegment;

  const customStagger = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
        ?.staggerChildren
    : undefined;

  const customDelay = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
        ?.delayChildren
    : undefined;

  const computedVariants = {
    container: createVariantsWithTransition(
      variants?.container || baseVariants.container,
      {
        staggerChildren: customStagger ?? stagger,
        delayChildren: customDelay ?? delay,
        ...containerTransition,
        exit: {
          staggerChildren: customStagger ?? stagger,
          staggerDirection: -1,
        },
      },
    ),
    item: createVariantsWithTransition(variants?.item || baseVariants.item, {
      duration: baseDuration,
      ...segmentTransition,
    }),
  };

  const wordStyleMap = useMemo(
    () => buildWordStyleMap(tokenStyles),
    [tokenStyles],
  );

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={computedVariants.container}
          className={className}
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
          style={style}
        >
          {per !== "line" ? <span className="sr-only">{children}</span> : null}
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}-${segment}`}
              segment={segment}
              variants={computedVariants.item}
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
              tokenStyles={tokenStyles}
              wordStyleMap={wordStyleMap}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}
