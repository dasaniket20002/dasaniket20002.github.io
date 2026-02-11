import {
  IconBrandFramerMotion,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandThreejs,
  IconBrandVite,
} from "@tabler/icons-react";
import { useInView, type HTMLMotionProps } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useImperativeHandle, useRef } from "react";
import Link from "../../components/link";
import { cn } from "../../utils";
import MessageBox from "./message-box";

const AboutContent = forwardRef<HTMLElement, HTMLMotionProps<"section">>(
  ({ className, ...motionProps }, ref) => {
    const containerRef = useRef<HTMLElement>(null);
    useImperativeHandle(ref, () => containerRef.current!);
    const isInView = useInView(containerRef, { margin: "-50% 0% -50% 0%" });

    return (
      <m.section
        ref={containerRef}
        className={cn(
          "grid grid-cols-[8rem_1fr_1fr_8rem] grid-rows-[var(--min-section-header-height)_1fr_1fr] md:grid-rows-[var(--section-header-height)_1fr_1fr]",
          className,
        )}
        {...motionProps}
      >
        <div className="col-span-full row-span-full grid grid-cols-subgrid grid-rows-subgrid opacity-25 mask-t-from-95% mask-b-from-95% mask-l-from-95% mask-r-from-95% pointer-events-none">
          <div className="row-[2/3] col-[1/2] border-r border-b border-dark-1" />
          <div className="row-[2/3] col-[3/5] border-l border-b border-dark-1" />
          <div className="row-[3/4] col-[3/5] border-l border-dark-1" />
        </div>

        <m.div
          initial={{ opacity: 0.1, filter: "blur(2px)" }}
          animate={{
            opacity: isInView ? 1 : 0.1,
            filter: isInView ? "blur(0px)" : "blur(2px)",
          }}
          className="col-span-full row-span-full grid grid-rows-subgrid grid-cols-subgrid gap-4"
        >
          <div className="row-span-full col-[2/3] max-w-lg w-full flex flex-col gap-3 py-8 text-dark-2 place-self-center">
            <m.div
              initial={{ opacity: 0, filter: "blur(2px)", y: -10 }}
              animate={{
                opacity: isInView ? 1 : 0,
                filter: isInView ? "blur(0px)" : "blur(2px)",
                y: isInView ? 0 : -10,
              }}
              transition={{ delay: 0.25 }}
              className="bg-light-2 py-1 px-2 text-xs w-min flex flex-col gap-0.5 items-center self-center rounded shadow"
            >
              <span className="font-light tracking-wider">Today</span>
            </m.div>

            <m.span
              initial={{
                opacity: 0,
                filter: "blur(2px)",
                scaleY: 0.25,
                rotate: "-10deg",
              }}
              animate={{
                opacity: isInView ? 1 : 0,
                filter: isInView ? "blur(0px)" : "blur(2px)",
                scaleY: isInView ? 1 : 0.25,
                rotate: isInView ? "0deg" : "-10deg",
              }}
              transition={{ delay: 0.5 }}
              className="self-end bg-dark-1 px-3 py-1 rounded space-y-1 ml-4 origin-bottom-right"
            >
              <p className="text-sm font-light tracking-wider">
                So tell me about urself...
              </p>
              <p className="text-xs text-end font-light tracking-wide opacity-75">
                {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                  -3,
                  "minute",
                )}
              </p>
            </m.span>
            <m.span
              initial={{
                opacity: 0,
                filter: "blur(2px)",
                scaleY: 0.25,
                rotate: "10deg",
              }}
              animate={{
                opacity: isInView ? 1 : 0,
                filter: isInView ? "blur(0px)" : "blur(2px)",
                scaleY: isInView ? 1 : 0.25,
                rotate: isInView ? "0deg" : "10deg",
              }}
              transition={{ delay: 0.6 }}
              className="self-start bg-light-2 px-3 py-2 rounded space-y-2 mr-4 origin-bottom-left"
            >
              <p className="text-xl [&>span]:italic font-thin [&>span]:font-normal tracking-wide px-3 py-2">
                I <span>specialize</span> in
                <br />
                crafting <span>interactive</span> and
                <br />
                motion-rich <span>experiences</span>
                <br />
                that blend design with code, from
                <br />
                <span>sleek</span> dashboards to
                <br />
                <span>expressive</span> front-end animations.
              </p>
              <p className="text-xs text-end font-light tracking-wide opacity-75">
                {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                  -3,
                  "minute",
                )}
              </p>
            </m.span>
            <m.span
              initial={{
                opacity: 0,
                filter: "blur(2px)",
                scaleY: 0.25,
                rotate: "-10deg",
              }}
              animate={{
                opacity: isInView ? 1 : 0,
                filter: isInView ? "blur(0px)" : "blur(2px)",
                scaleY: isInView ? 1 : 0.25,
                rotate: isInView ? "0deg" : "-10deg",
              }}
              transition={{ delay: 0.7 }}
              className="self-end bg-dark-1 px-3 py-1 rounded space-y-1 ml-4 origin-bottom-right"
            >
              <p className="text-sm font-light tracking-wider">
                Interesting...
              </p>
              <p className="text-xs text-end font-light tracking-wide opacity-75">
                {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                  -1,
                  "minute",
                )}
              </p>
            </m.span>
            <m.span
              initial={{
                opacity: 0,
                filter: "blur(2px)",
                scaleY: 0.25,
                rotate: "10deg",
              }}
              animate={{
                opacity: isInView ? 1 : 0,
                filter: isInView ? "blur(0px)" : "blur(2px)",
                scaleY: isInView ? 1 : 0.25,
                rotate: isInView ? "0deg" : "10deg",
              }}
              transition={{ delay: 0.8 }}
              className="self-start bg-light-2 px-3 py-2 rounded space-y-2 mr-4"
            >
              <p className="text-lg [&>span]:italic font-thin [&>span]:font-normal tracking-wider px-3 py-2">
                My <span>passion</span> lies in
                <br />
                <span>creating</span> design systems,
                <br />
                <span>exploring</span> interaction, and
                <br />
                <span>pushing</span> what's possible on the web.
              </p>
              <p className="text-xs text-end font-light tracking-wide opacity-75">
                {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                  -1,
                  "minute",
                )}
              </p>
            </m.span>
            <m.span
              initial={{
                opacity: 0,
                filter: "blur(2px)",
                scaleY: 0.25,
                rotate: "-10deg",
              }}
              animate={{
                opacity: isInView ? 1 : 0,
                filter: isInView ? "blur(0px)" : "blur(2px)",
                scaleY: isInView ? 1 : 0.25,
                rotate: isInView ? "0deg" : "-10deg",
              }}
              transition={{ delay: 0.9 }}
              className="self-end bg-dark-1 px-3 py-1 rounded space-y-1 ml-4 origin-bottom-right"
            >
              <p className="text-sm font-light tracking-wider">
                I'm listening...
              </p>
              <p className="text-xs text-end font-light tracking-wide opacity-75">
                {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                  -1,
                  "minute",
                )}
              </p>
            </m.span>
            <m.span
              initial={{
                opacity: 0,
                filter: "blur(2px)",
                scaleY: 0.25,
                rotate: "10deg",
              }}
              animate={{
                opacity: isInView ? 1 : 0,
                filter: isInView ? "blur(0px)" : "blur(2px)",
                scaleY: isInView ? 1 : 0.25,
                rotate: isInView ? "0deg" : "10deg",
              }}
              transition={{ delay: 1.0 }}
              className="self-start bg-light-2 px-2 py-1 rounded space-y-1 mr-4 origin-bottom-left"
            >
              <p className="text-sm [&>span]:italic font-thin [&>span]:font-normal tracking-widest px-2 py-1">
                I have 3 pets, and I'm really
                <br />
                <span>responsible</span> towards them.
                <br />I love Biriyani as well.
              </p>
              <p className="text-xs text-end font-light tracking-wide opacity-75">
                {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                  -1,
                  "minute",
                )}
              </p>
            </m.span>

            <MessageBox
              initial={{ opacity: 0, filter: "blur(2px)", y: 10 }}
              animate={{
                opacity: isInView ? 1 : 0,
                filter: isInView ? "blur(0px)" : "blur(2px)",
                y: isInView ? 0 : 10,
              }}
              transition={{ delay: 0.25 }}
              className="mt-4"
            />
          </div>

          <div className="row-[2/3] col-[3/4] @container-[size] flex items-end gap-8 p-3">
            <div className="cqw-landscape:h-8/10 cqw-portrait:w-8/10 aspect-square overflow-hidden rounded-lg shadow-2xl flex items-center">
              <img
                src="/assets/portrait/Portrait-FULL.png"
                alt="Portrait"
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="px-2 font-light text-4xl leading-4">
                Hi!
                <br />
                I'm{" "}
                <span className="font-normal tracking-tight text-5xl">
                  Aniket Das
                </span>
                .
              </h1>
              <div className="grid grid-cols-[2rem_1fr] gap-y-0.5 gap-x-1 h-min py-4 z-1">
                <span className="relative size-2 place-self-center bg-success rounded-full before:absolute before:-inset-px before:rounded-full before:bg-success before:blur-xs before:animate-pulse before:duration-1000" />
                <h2 className="py-2 font-light">Active Tech</h2>

                <IconBrandVite className="size-4 stroke-1 place-self-center" />
                <Link
                  href="https://vite.dev/"
                  theme="dark"
                  className="w-min whitespace-nowrap font-thin tracking-wider -ml-1"
                >
                  Vite
                </Link>

                <IconBrandReact className="size-4 stroke-1 place-self-center" />
                <Link
                  href="https://react.dev/"
                  theme="dark"
                  className="w-min whitespace-nowrap font-thin tracking-wider -ml-1"
                >
                  React
                </Link>

                <IconBrandFramerMotion className="size-4 stroke-1 place-self-center" />
                <Link
                  href="https://m.dev/"
                  theme="dark"
                  className="w-min whitespace-nowrap font-thin tracking-wider -ml-1"
                >
                  Motion
                </Link>

                <IconBrandTailwind className="size-4 stroke-1 place-self-center" />
                <Link
                  href="https://tailwindcss.com/"
                  theme="dark"
                  className="w-min whitespace-nowrap font-thin tracking-wider -ml-1"
                >
                  Tailwind CSS
                </Link>

                <IconBrandThreejs className="size-4 stroke-1 place-self-center" />
                <Link
                  href="https://r3f.docs.pmnd.rs/getting-started/introduction"
                  theme="dark"
                  className="w-min whitespace-nowrap font-thin tracking-wider -ml-1"
                >
                  React Three Fiber
                </Link>
              </div>
            </div>
          </div>
        </m.div>
      </m.section>
    );
  },
);

export default AboutContent;
