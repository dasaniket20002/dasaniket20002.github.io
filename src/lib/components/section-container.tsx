import { type HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef } from "react";
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
    return (
      <m.div
        ref={ref}
        {...motionProps}
        className={cn(
          "relative",
          "[&>section]:h-[calc(100vh-var(--header-height))]",
          theme === "light" && "[&>section]:text-light-2 bg-dark-2",
          theme === "dark" && "[&>section]:text-dark-1 bg-light-1",
          className,
        )}
      >
        <div
          data-bg-theme={theme}
          className={cn(
            "grid grid-cols-[8rem_1fr_1fr_8rem]",
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
              "col-[1/2] row-[2/3] rounded-br-[6px]",
              theme === "light" && "bg-light-1",
              theme === "dark" && "bg-dark-2",
            )}
          />
          <div
            className={cn(
              "col-[-1/-2] row-[2/3]",
              theme === "light" && "bg-light-1",
              theme === "dark" && "bg-dark-2",
            )}
          />
          <div className="row-[2/3] col-[2/3] size-full">
            <svg className="size-full">
              <defs>
                <mask id={`cover-mask-${title}`}>
                  <rect width="100%" height="100%" fill="white" />
                  <rect width="100%" height="100%" fill="black" rx="8" ry="8" />
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
          <div className="row-[2/3] col-[3/4] size-full rounded-bl-[6px] overflow-hidden">
            <svg className="size-full text-5xl md:text-8xl text-end font-black tracking-[-0.5rem] font-width-115 trim-text-caps">
              <defs>
                <mask id={`text-mask-${title}`}>
                  <rect width="100%" height="100%" fill="white" />
                  <text x="2%" y="100%" textAnchor="start" fill="black">
                    {title}
                  </text>
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
        </div>

        {children}
      </m.div>
    );
  },
);

export default SectionContainer;
