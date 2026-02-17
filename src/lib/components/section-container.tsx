import {
  useMotionTemplate,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useRef } from "react";
import { HEADER_HEIGHT } from "../../App";
import { useWindowSize } from "../hooks/use-window-size";
import { cn } from "../utils";

export type SectionContainerProps = {
  className?: string;
  title: string;
  subTitle: string;
  children?: React.ReactNode;
  theme?: "light" | "dark";
} & HTMLMotionProps<"div">;

const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  (
    { className, children, title, subTitle, theme = "light", ...motionProps },
    ref,
  ) => {
    const scrollTargetRef = useRef<HTMLDivElement>(null);
    const { width: windowWidth } = useWindowSize();
    const { scrollYProgress } = useScroll({
      offset: [`${HEADER_HEIGHT}px end`, `-${HEADER_HEIGHT}px start`],
      target: scrollTargetRef,
    });
    const transformTitle = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);
    const _borderRadius = useTransform(scrollYProgress, [0, 1], [64, 8]);
    const borderRadius = useMotionTemplate`${_borderRadius}px`;

    return (
      <m.div
        ref={ref}
        {...motionProps}
        className={cn(
          "relative",
          "[&>section]:h-[calc(100dvh-var(--header-height))]",
          theme === "light" && "[&>section]:text-light-2 bg-dark-2",
          theme === "dark" && "[&>section]:text-dark-1 bg-light-1",
          className,
        )}
        style={{ "--animated-rounded": borderRadius } as React.CSSProperties}
      >
        <div
          ref={scrollTargetRef}
          data-bg-theme={theme}
          className={cn(
            "grid",
            "grid-cols-[4rem_1fr_1fr_4rem] md:grid-cols-[8rem_1fr_1fr_8rem]",
            "grid-rows-[var(--header-height)_var(--min-section-header-height)]",
            "md:grid-rows-[var(--header-height)_var(--section-header-height)]",
            "uppercase sticky top-0 z-90 pointer-events-none",
          )}
        >
          <div
            className={cn(
              "col-span-full row-[1/2]",
              theme === "light" && "bg-light-1",
              theme === "dark" && "bg-dark-2",
            )}
          />
          <div
            className={cn(
              "col-[1/2] row-[2/3] rounded-br-(--animated-rounded)",
              theme === "light" && "bg-light-1",
              theme === "dark" && "bg-dark-2",
            )}
          />
          <div
            className={cn(
              "col-[-1/-2] row-[2/3] rounded-bl-(--animated-rounded) md:rounded-none",
              theme === "light" && "bg-light-1",
              theme === "dark" && "bg-dark-2",
            )}
          />
          <div className="row-[2/3] col-[2/4] md:col-[2/3] size-full">
            <svg className="size-full">
              <defs>
                <mask id={`cover-mask-${title}`}>
                  <rect width="100%" height="100%" fill="white" />
                  <m.rect
                    width="100%"
                    height="100%"
                    fill="black"
                    rx={_borderRadius}
                    ry={_borderRadius}
                  />
                  <rect width="100%" height="50%" fill="black" y="50%" />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                mask={`url(#cover-mask-${title})`}
                className={cn(
                  theme === "light" && "fill-light-1",
                  theme === "dark" && "fill-dark-2",
                )}
              />
            </svg>
          </div>

          <div data-attr="new" className="absolute top-full size-full">
            <svg className="size-full">
              <defs>
                <mask id={`cover-mask-body-${title}`}>
                  <rect width="100%" height="100%" fill="white" />
                  <m.rect
                    width="100%"
                    height="100%"
                    fill="black"
                    rx={_borderRadius}
                    ry={_borderRadius}
                  />
                  <rect width="100%" height="50%" fill="black" y="50%" />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                mask={`url(#cover-mask-body-${title})`}
                className={cn(
                  theme === "light" && "fill-light-1",
                  theme === "dark" && "fill-dark-2",
                )}
              />
            </svg>
          </div>

          {windowWidth >= 768 ? (
            <div className="row-[2/3] col-[3/4] size-full rounded-bl-(--animated-rounded) overflow-hidden">
              <svg className="size-full text-9xl text-end font-[1000] tracking-[-0.5rem] font-width-125 trim-text-caps">
                <defs>
                  <mask id={`text-mask-${title}`}>
                    <rect width="100%" height="100%" fill="white" />
                    <m.text
                      x="2%"
                      y="100%"
                      textAnchor="start"
                      fill="black"
                      style={{ y: transformTitle }}
                    >
                      {title}
                    </m.text>
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  mask={`url(#text-mask-${title})`}
                  className={cn(
                    theme === "light" && "fill-light-1",
                    theme === "dark" && "fill-dark-2",
                  )}
                />
              </svg>
            </div>
          ) : (
            <div className="row-[2/3] col-[3/4] size-full place-items-end place-content-end">
              <m.h1
                className={cn(
                  "text-8xl font-[1000] tracking-[-0.5rem] font-width-125 trim-text-caps px-1",
                  theme === "light" && "text-light-1",
                  theme === "dark" && "text-dark-2",
                )}
                style={{ x: transformTitle }}
              >
                {title}
              </m.h1>
            </div>
          )}
        </div>

        {children}
      </m.div>
    );
  },
);

export default SectionContainer;
