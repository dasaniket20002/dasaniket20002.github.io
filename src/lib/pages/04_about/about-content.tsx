import {
  IconBrandFramerMotion,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandThreejs,
  IconBrandVite,
} from "@tabler/icons-react";
import { motion, useInView, type HTMLMotionProps } from "motion/react";
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
      <motion.section
        ref={containerRef}
        className={cn(
          "grid grid-rows-4 grid-cols-5 px-4 md:px-16 py-2",
          className,
        )}
        {...motionProps}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 0.25 : 0 }}
          className="col-span-full row-span-full grid grid-cols-subgrid grid-rows-subgrid mask-radial-at-center mask-radial-closest-corner mask-radial-from-0% pointer-events-none"
        >
          <div className="row-[1/2] col-[2/3] border-r border-dark-1" />
          <div className="row-[2/3] col-[2/3] border-r border-l border-dark-1" />
          <div className="row-[3/5] col-[1/3] border-t border-r border-dark-1" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.1, filter: "blur(2px)" }}
          animate={{
            opacity: isInView ? 1 : 0.1,
            filter: isInView ? "blur(0px)" : "blur(2px)",
          }}
          className="col-span-full row-span-full grid grid-rows-subgrid grid-cols-subgrid gap-4"
        >
          <div className="row-[1/3] col-[1/2] h-8/10 aspect-square overflow-hidden rounded-lg shadow-2xl flex items-center place-self-end mx-8">
            <img
              src="/assets/portrait/Portrait-FULL.png"
              alt="Portrait"
              className="object-contain"
            />
          </div>
          <h1 className="row-[1/2] col-[2/3] font-light text-4xl leading-4 [&>span]:font-normal [&>span]:tracking-tight [&>span]:text-5xl self-end">
            Hi!
            <br />
            I'm <span>Aniket Das</span>.
          </h1>
          <div className="row-[2/3] col-[2/3] grid grid-cols-[2rem_1fr] gap-y-0.5 gap-x-1 h-min py-4 z-1">
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
              href="https://motion.dev/"
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

          <div className="row-span-full col-[3/6] max-w-lg w-full flex flex-col gap-3 py-8 text-dark-2 place-self-center">
            <motion.div
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
            </motion.div>

            <motion.span
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
              <p className="text-sm font-light tracking-wider">So tell me...</p>
              <p className="text-xs text-end font-light tracking-wide opacity-75">
                {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                  -3,
                  "minute",
                )}
              </p>
            </motion.span>
            <motion.span
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
            </motion.span>
            <motion.span
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
            </motion.span>
            <motion.span
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
            </motion.span>
            <motion.span
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
            </motion.span>
            <motion.span
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
            </motion.span>

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
        </motion.div>
      </motion.section>
    );
  },
);

export default AboutContent;
