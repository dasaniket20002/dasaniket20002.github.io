import {
  motion,
  useInView,
  type HTMLMotionProps,
  type SVGMotionProps,
} from "motion/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { cn } from "../utils";
import { useElementSize } from "../hooks/use-element-size";
import { useBGTheme } from "../hooks/use-bg-theme";

export type ArcPathSVGProps = {
  className?: string;
  width?: number;
  height?: number;
} & SVGMotionProps<SVGPathElement>;

export type GoldenGridProps = {
  className?: string;
  landscapeConvergeQuadrant:
    | "top-left"
    | "bottom-left"
    | "top-right"
    | "bottom-right";
  portraitConvergeQuadrant:
    | "top-left"
    | "bottom-left"
    | "top-right"
    | "bottom-right";
  useReveal?: boolean;
} & HTMLMotionProps<"div">;

const ArcPathSVG = forwardRef<SVGSVGElement, ArcPathSVGProps>(
  ({ className, width = 100, height = 100, ...motionProps }, ref) => {
    return (
      <motion.svg
        ref={ref}
        className={cn(
          "fill-none stroke-current stroke-1 overflow-visible",
          className,
        )}
        viewBox={`0 0 ${width} ${height}`}
      >
        <motion.path
          {...motionProps}
          strokeLinecap="square"
          d={`M0 0 A${width} ${height} 0 0 1 ${width} ${height}`}
        />
      </motion.svg>
    );
  },
);

function GridGoldenCell({
  isInView,
  className,
  ...motionProps
}: {
  isInView: boolean;
  className?: string;
} & Omit<SVGMotionProps<SVGPathElement>, "width" | "height">) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { width, height } = useElementSize(containerRef);
  const bgTheme = useBGTheme(containerRef);
  return (
    <span
      ref={containerRef}
      className={cn(
        "relative outline outline-dashed transition-[outline] size-full",
        isInView
          ? bgTheme === "dark"
            ? "outline-light-2/25"
            : "outline-dark-1/10"
          : bgTheme === "dark"
            ? "outline-light-2/50"
            : "outline-dark-1/25",
        className,
      )}
    >
      <ArcPathSVG
        width={width}
        height={height}
        className={cn(
          "absolute inset-0 stroke-2",
          bgTheme === "dark" ? "stroke-light-2" : "stroke-dark-1",
        )}
        {...motionProps}
      />
    </span>
  );
}

const GridGolden = forwardRef<HTMLDivElement, GoldenGridProps>(
  (
    {
      className,
      landscapeConvergeQuadrant = "top-right",
      portraitConvergeQuadrant = "top-right",
      ...motionProps
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, {
      once: false,
      margin: "-25% 0% -75% 0%",
    });
    // const isInView = false;

    useImperativeHandle(ref, () => containerRef.current!);

    return (
      <motion.div
        ref={containerRef}
        {...motionProps}
        data-grid-landscape-converge-quadtant={landscapeConvergeQuadrant}
        data-grid-portrait-converge-quadtant={portraitConvergeQuadrant}
        className={cn(
          "grid",
          "cqw-portrait:[--ar-w:21] cqw-portrait:[--ar-h:34] cqw-landscape:[--ar-w:34] cqw-landscape:[--ar-h:21]",
          "aspect-[calc(var(--ar-w)/var(--ar-h))] w-[min(100cqw,calc(100cqh*var(--ar-w)/var(--ar-h)))]",
          landscapeConvergeQuadrant === "top-left" &&
            "cqw-landscape:grid-rows-[5fr_1fr_2fr_13fr] cqw-landscape:grid-cols-[8fr_1fr_1fr_3fr_21fr]",
          landscapeConvergeQuadrant === "top-right" &&
            "cqw-landscape:grid-rows-[5fr_1fr_2fr_13fr] cqw-landscape:grid-cols-[21fr_3fr_1fr_1fr_8fr]",
          landscapeConvergeQuadrant === "bottom-left" &&
            "cqw-landscape:grid-rows-[13fr_2fr_1fr_5fr] cqw-landscape:grid-cols-[8fr_1fr_1fr_3fr_21fr]",
          landscapeConvergeQuadrant === "bottom-right" &&
            "cqw-landscape:grid-rows-[13fr_2fr_1fr_5fr] cqw-landscape:grid-cols-[21fr_3fr_1fr_1fr_8fr]",
          portraitConvergeQuadrant === "top-left" &&
            "cqw-portrait:grid-rows-[8fr_1fr_1fr_3fr_21fr] cqw-portrait:grid-cols-[5fr_1fr_2fr_13fr]",
          portraitConvergeQuadrant === "top-right" &&
            "cqw-portrait:grid-rows-[8fr_1fr_1fr_3fr_21fr] cqw-portrait:grid-cols-[13fr_2fr_1fr_5fr]",
          portraitConvergeQuadrant === "bottom-left" &&
            "cqw-portrait:grid-rows-[21fr_3fr_1fr_1fr_8fr] cqw-portrait:grid-cols-[5fr_1fr_2fr_13fr]",
          portraitConvergeQuadrant === "bottom-right" &&
            "cqw-portrait:grid-rows-[21fr_3fr_1fr_1fr_8fr] cqw-portrait:grid-cols-[13fr_2fr_1fr_5fr]",
          className,
        )}
      >
        <div
          className={cn(
            "relative",
            "grid col-span-full row-span-full grid-cols-subgrid grid-rows-subgrid z-1",
            isInView ? "pointer-events-none" : "pointer-events-auto",
            landscapeConvergeQuadrant === "top-left" &&
              `
              [&>:nth-child(1)]:cqw-landscape:row-[1/5] [&>:nth-child(1)]:cqw-landscape:col-[5/6]
              [&>:nth-child(2)]:cqw-landscape:row-[4/5] [&>:nth-child(2)]:cqw-landscape:col-[1/5]
              [&>:nth-child(3)]:cqw-landscape:row-[1/4] [&>:nth-child(3)]:cqw-landscape:col-[1/2]
              [&>:nth-child(4)]:cqw-landscape:row-[1/2] [&>:nth-child(4)]:cqw-landscape:col-[2/5]
              [&>:nth-child(5)]:cqw-landscape:row-[2/4] [&>:nth-child(5)]:cqw-landscape:col-[4/5]
              [&>:nth-child(6)]:cqw-landscape:row-[3/4] [&>:nth-child(6)]:cqw-landscape:col-[2/4]
              [&>:nth-child(7)]:cqw-landscape:row-[2/3] [&>:nth-child(7)]:cqw-landscape:col-[2/3]
              [&>:nth-child(8)]:cqw-landscape:row-[2/3] [&>:nth-child(8)]:cqw-landscape:col-[3/4]
              `,
            landscapeConvergeQuadrant === "top-right" &&
              `
              [&>:nth-child(1)]:cqw-landscape:row-[1/5] [&>:nth-child(1)]:cqw-landscape:col-[1/2]
              [&>:nth-child(2)]:cqw-landscape:row-[4/5] [&>:nth-child(2)]:cqw-landscape:col-[2/6]
              [&>:nth-child(3)]:cqw-landscape:row-[1/4] [&>:nth-child(3)]:cqw-landscape:col-[5/6]
              [&>:nth-child(4)]:cqw-landscape:row-[1/2] [&>:nth-child(4)]:cqw-landscape:col-[2/5]
              [&>:nth-child(5)]:cqw-landscape:row-[2/4] [&>:nth-child(5)]:cqw-landscape:col-[2/3]
              [&>:nth-child(6)]:cqw-landscape:row-[3/4] [&>:nth-child(6)]:cqw-landscape:col-[3/5]
              [&>:nth-child(7)]:cqw-landscape:row-[2/3] [&>:nth-child(7)]:cqw-landscape:col-[4/5]
              [&>:nth-child(8)]:cqw-landscape:row-[2/3] [&>:nth-child(8)]:cqw-landscape:col-[3/4]
              `,
            landscapeConvergeQuadrant === "bottom-left" &&
              `
              [&>:nth-child(1)]:cqw-landscape:row-[1/5] [&>:nth-child(1)]:cqw-landscape:col-[5/6]
              [&>:nth-child(2)]:cqw-landscape:row-[1/2] [&>:nth-child(2)]:cqw-landscape:col-[1/5]
              [&>:nth-child(3)]:cqw-landscape:row-[2/5] [&>:nth-child(3)]:cqw-landscape:col-[1/2]
              [&>:nth-child(4)]:cqw-landscape:row-[4/5] [&>:nth-child(4)]:cqw-landscape:col-[2/5]
              [&>:nth-child(5)]:cqw-landscape:row-[2/4] [&>:nth-child(5)]:cqw-landscape:col-[4/5]
              [&>:nth-child(6)]:cqw-landscape:row-[2/3] [&>:nth-child(6)]:cqw-landscape:col-[2/4]
              [&>:nth-child(7)]:cqw-landscape:row-[3/4] [&>:nth-child(7)]:cqw-landscape:col-[2/3]
              [&>:nth-child(8)]:cqw-landscape:row-[3/4] [&>:nth-child(8)]:cqw-landscape:col-[3/4]
              `,
            landscapeConvergeQuadrant === "bottom-right" &&
              `
              [&>:nth-child(1)]:cqw-landscape:row-[1/5] [&>:nth-child(1)]:cqw-landscape:col-[1/2]
              [&>:nth-child(2)]:cqw-landscape:row-[1/2] [&>:nth-child(2)]:cqw-landscape:col-[2/6]
              [&>:nth-child(3)]:cqw-landscape:row-[2/5] [&>:nth-child(3)]:cqw-landscape:col-[5/6]
              [&>:nth-child(4)]:cqw-landscape:row-[4/5] [&>:nth-child(4)]:cqw-landscape:col-[2/5]
              [&>:nth-child(5)]:cqw-landscape:row-[2/4] [&>:nth-child(5)]:cqw-landscape:col-[2/3]
              [&>:nth-child(6)]:cqw-landscape:row-[2/3] [&>:nth-child(6)]:cqw-landscape:col-[3/5]
              [&>:nth-child(7)]:cqw-landscape:row-[3/4] [&>:nth-child(7)]:cqw-landscape:col-[4/5]
              [&>:nth-child(8)]:cqw-landscape:row-[3/4] [&>:nth-child(8)]:cqw-landscape:col-[3/4]
              `,
            portraitConvergeQuadrant === "top-left" &&
              `
              [&>:nth-child(1)]:cqw-portrait:row-[5/6] [&>:nth-child(1)]:cqw-portrait:col-[1/5]
              [&>:nth-child(2)]:cqw-portrait:row-[1/5] [&>:nth-child(2)]:cqw-portrait:col-[4/5]
              [&>:nth-child(3)]:cqw-portrait:row-[1/2] [&>:nth-child(3)]:cqw-portrait:col-[1/4]
              [&>:nth-child(4)]:cqw-portrait:row-[2/5] [&>:nth-child(4)]:cqw-portrait:col-[1/2]
              [&>:nth-child(5)]:cqw-portrait:row-[4/5] [&>:nth-child(5)]:cqw-portrait:col-[2/4]
              [&>:nth-child(6)]:cqw-portrait:row-[2/4] [&>:nth-child(6)]:cqw-portrait:col-[3/4]
              [&>:nth-child(7)]:cqw-portrait:row-[2/3] [&>:nth-child(7)]:cqw-portrait:col-[2/3]
              [&>:nth-child(8)]:cqw-portrait:row-[3/4] [&>:nth-child(8)]:cqw-portrait:col-[2/3]
              `,
            portraitConvergeQuadrant === "top-right" &&
              `
              [&>:nth-child(1)]:cqw-portrait:row-[5/6] [&>:nth-child(1)]:cqw-portrait:col-[1/5]
              [&>:nth-child(2)]:cqw-portrait:row-[1/5] [&>:nth-child(2)]:cqw-portrait:col-[1/2]
              [&>:nth-child(3)]:cqw-portrait:row-[1/2] [&>:nth-child(3)]:cqw-portrait:col-[2/5]
              [&>:nth-child(4)]:cqw-portrait:row-[2/5] [&>:nth-child(4)]:cqw-portrait:col-[4/5]
              [&>:nth-child(5)]:cqw-portrait:row-[4/5] [&>:nth-child(5)]:cqw-portrait:col-[2/4]
              [&>:nth-child(6)]:cqw-portrait:row-[2/4] [&>:nth-child(6)]:cqw-portrait:col-[2/3]
              [&>:nth-child(7)]:cqw-portrait:row-[2/3] [&>:nth-child(7)]:cqw-portrait:col-[3/4]
              [&>:nth-child(8)]:cqw-portrait:row-[3/4] [&>:nth-child(8)]:cqw-portrait:col-[3/4]
              `,
            portraitConvergeQuadrant === "bottom-left" &&
              `
              [&>:nth-child(1)]:cqw-portrait:row-[1/2] [&>:nth-child(1)]:cqw-portrait:col-[1/5]
              [&>:nth-child(2)]:cqw-portrait:row-[2/6] [&>:nth-child(2)]:cqw-portrait:col-[4/5]
              [&>:nth-child(3)]:cqw-portrait:row-[5/6] [&>:nth-child(3)]:cqw-portrait:col-[1/4]
              [&>:nth-child(4)]:cqw-portrait:row-[2/5] [&>:nth-child(4)]:cqw-portrait:col-[1/2]
              [&>:nth-child(5)]:cqw-portrait:row-[2/3] [&>:nth-child(5)]:cqw-portrait:col-[2/4]
              [&>:nth-child(6)]:cqw-portrait:row-[3/5] [&>:nth-child(6)]:cqw-portrait:col-[3/4]
              [&>:nth-child(7)]:cqw-portrait:row-[4/5] [&>:nth-child(7)]:cqw-portrait:col-[2/3]
              [&>:nth-child(8)]:cqw-portrait:row-[3/4] [&>:nth-child(8)]:cqw-portrait:col-[2/3]
              `,
            portraitConvergeQuadrant === "bottom-right" &&
              `
              [&>:nth-child(1)]:cqw-portrait:row-[1/2] [&>:nth-child(1)]:cqw-portrait:col-[1/5]
              [&>:nth-child(2)]:cqw-portrait:row-[2/6] [&>:nth-child(2)]:cqw-portrait:col-[1/2]
              [&>:nth-child(3)]:cqw-portrait:row-[5/6] [&>:nth-child(3)]:cqw-portrait:col-[2/5]
              [&>:nth-child(4)]:cqw-portrait:row-[2/5] [&>:nth-child(4)]:cqw-portrait:col-[4/5]
              [&>:nth-child(5)]:cqw-portrait:row-[2/3] [&>:nth-child(5)]:cqw-portrait:col-[2/4]
              [&>:nth-child(6)]:cqw-portrait:row-[3/5] [&>:nth-child(6)]:cqw-portrait:col-[2/3]
              [&>:nth-child(7)]:cqw-portrait:row-[4/5] [&>:nth-child(7)]:cqw-portrait:col-[3/4]
              [&>:nth-child(8)]:cqw-portrait:row-[3/4] [&>:nth-child(8)]:cqw-portrait:col-[3/4]
              `,
          )}
        >
          <GridGoldenCell
            isInView={isInView}
            className={cn(
              landscapeConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-landscape:rotate-90",
              landscapeConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-landscape:rotate-180",
              landscapeConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-landscape:rotate-0",
              landscapeConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-landscape:rotate-270",
              portraitConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-portrait:rotate-90",
              portraitConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-portrait:rotate-180",
              portraitConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-portrait:rotate-0",
              portraitConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-portrait:rotate-270",
            )}
            initial={{ pathLength: 1 }}
            whileInView={{ pathLength: 0 }}
            transition={{ duration: 2 }}
          />
          <GridGoldenCell
            isInView={isInView}
            className={cn(
              landscapeConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-landscape:rotate-180",
              landscapeConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-landscape:rotate-90",
              landscapeConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-landscape:rotate-270",
              landscapeConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-landscape:rotate-0",
              portraitConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-portrait:rotate-0",
              portraitConvergeQuadrant === "top-right" &&
                "[&>svg]:[&>svg]:cqw-portrait:rotate-270",
              portraitConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-portrait:rotate-90",
              portraitConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-portrait:rotate-180",
            )}
            initial={{ pathLength: 1 }}
            whileInView={{ pathLength: 0 }}
            transition={{ duration: 2 }}
          />
          <GridGoldenCell
            isInView={isInView}
            className={cn(
              landscapeConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-landscape:rotate-270",
              landscapeConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-landscape:rotate-0",
              landscapeConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-landscape:rotate-180",
              landscapeConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-landscape:rotate-90",
              portraitConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-portrait:rotate-270",
              portraitConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-portrait:rotate-0",
              portraitConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-portrait:rotate-180",
              portraitConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-portrait:rotate-90",
            )}
            initial={{ pathLength: 1 }}
            whileInView={{ pathLength: 0 }}
            transition={{ duration: 2 }}
          />
          <GridGoldenCell
            isInView={isInView}
            className={cn(
              landscapeConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-landscape:rotate-0",
              landscapeConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-landscape:rotate-270",
              landscapeConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-landscape:rotate-90",
              landscapeConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-landscape:rotate-180",
              portraitConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-portrait:rotate-180",
              portraitConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-portrait:rotate-90",
              portraitConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-portrait:rotate-270",
              portraitConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-portrait:rotate-0",
            )}
            initial={{ pathLength: 1 }}
            whileInView={{ pathLength: 0 }}
            transition={{ duration: 2 }}
          />
          <GridGoldenCell
            isInView={isInView}
            className={cn(
              landscapeConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-landscape:rotate-90",
              landscapeConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-landscape:rotate-180",
              landscapeConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-landscape:rotate-0",
              landscapeConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-landscape:rotate-270",
              portraitConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-portrait:rotate-90",
              portraitConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-portrait:rotate-180",
              portraitConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-portrait:rotate-0",
              portraitConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-portrait:rotate-270",
            )}
            initial={{ pathLength: 1 }}
            whileInView={{ pathLength: 0 }}
            transition={{ duration: 2 }}
          />
          <GridGoldenCell
            isInView={isInView}
            className={cn(
              landscapeConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-landscape:rotate-180",
              landscapeConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-landscape:rotate-90",
              landscapeConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-landscape:rotate-270",
              landscapeConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-landscape:rotate-0",
              portraitConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-portrait:rotate-0",
              portraitConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-portrait:rotate-270",
              portraitConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-portrait:rotate-90",
              portraitConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-portrait:rotate-180",
            )}
            initial={{ pathLength: 1 }}
            whileInView={{ pathLength: 0 }}
            transition={{ duration: 2 }}
          />
          <GridGoldenCell
            isInView={isInView}
            className={cn(
              landscapeConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-landscape:rotate-270",
              landscapeConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-landscape:rotate-0",
              landscapeConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-landscape:rotate-180",
              landscapeConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-landscape:rotate-90",
              portraitConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-portrait:rotate-270",
              portraitConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-portrait:rotate-0",
              portraitConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-portrait:rotate-180",
              portraitConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-portrait:rotate-90",
            )}
            initial={{ pathLength: 1 }}
            whileInView={{ pathLength: 0 }}
            transition={{ duration: 2 }}
          />
          <GridGoldenCell
            isInView={isInView}
            className={cn(
              landscapeConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-landscape:rotate-0",
              landscapeConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-landscape:rotate-270",
              landscapeConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-landscape:rotate-90",
              landscapeConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-landscape:rotate-180",
              portraitConvergeQuadrant === "top-left" &&
                "[&>svg]:cqw-portrait:rotate-180",
              portraitConvergeQuadrant === "top-right" &&
                "[&>svg]:cqw-portrait:rotate-90",
              portraitConvergeQuadrant === "bottom-left" &&
                "[&>svg]:cqw-portrait:rotate-270",
              portraitConvergeQuadrant === "bottom-right" &&
                "[&>svg]:cqw-portrait:rotate-0",
            )}
            initial={{ pathLength: 1 }}
            whileInView={{ pathLength: 0 }}
            transition={{ duration: 2 }}
          />
        </div>
      </motion.div>
    );
  },
);

export default GridGolden;
