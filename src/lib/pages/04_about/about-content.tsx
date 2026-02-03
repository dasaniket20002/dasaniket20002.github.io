import {
  IconBrandFramerMotion,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandThreejs,
  IconBrandVite,
} from "@tabler/icons-react";
import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";
import Link from "../../components/link";
import { cn } from "../../utils";

const AboutContent = forwardRef<HTMLElement, HTMLMotionProps<"section">>(
  ({ className, ...motionProps }, ref) => {
    return (
      <motion.section
        ref={ref}
        className={cn(
          "grid grid-rows-4 grid-cols-5 px-4 md:px-16 py-2",
          className,
        )}
        {...motionProps}
      >
        <div className="col-span-full row-span-full grid grid-rows-subgrid grid-cols-subgrid gap-4">
          <div className="row-[1/2] col-[1/2] h-8/10 aspect-square overflow-hidden rounded-lg shadow-2xl flex items-center place-self-end mx-8">
            <img
              src="/assets/portrait/Portrait-FULL.png"
              alt="Portrait"
              className="object-contain"
            />
          </div>
          <h1 className="row-[1/2] col-[2/4] font-light text-4xl leading-4 [&>span]:font-normal [&>span]:tracking-tight [&>span]:text-5xl self-end">
            Hi!
            <br />
            I'm <span>Aniket Das</span>.
          </h1>
          <div className="row-[2/3] col-[2/4] grid grid-cols-[2rem_1fr] gap-y-0.5 h-min py-4 z-1">
            <span className="relative size-2 self-center bg-success rounded-full before:absolute before:-inset-px before:rounded-full before:bg-success before:blur-xs before:animate-pulse before:duration-1000" />
            <h2 className="py-2 font-light">Active Tech</h2>

            <IconBrandVite className="size-4 stroke-1 self-center" />
            <Link
              href="https://vite.dev/"
              theme="dark"
              className="w-min whitespace-nowrap font-thin tracking-wider -ml-1"
            >
              Vite
            </Link>

            <IconBrandReact className="size-4 stroke-1 self-center" />
            <Link
              href="https://react.dev/"
              theme="dark"
              className="w-min whitespace-nowrap font-thin tracking-wider -ml-1"
            >
              React
            </Link>

            <IconBrandFramerMotion className="size-4 stroke-1 self-center" />
            <Link
              href="https://motion.dev/"
              theme="dark"
              className="w-min whitespace-nowrap font-thin tracking-wider -ml-1"
            >
              Motion
            </Link>

            <IconBrandTailwind className="size-4 stroke-1 self-center" />
            <Link
              href="https://tailwindcss.com/"
              theme="dark"
              className="w-min whitespace-nowrap font-thin tracking-wider -ml-1"
            >
              Tailwind CSS
            </Link>

            <IconBrandThreejs className="size-4 stroke-1 self-center" />
            <Link
              href="https://r3f.docs.pmnd.rs/getting-started/introduction"
              theme="dark"
              className="w-min whitespace-nowrap font-thin tracking-wider -ml-1"
            >
              React Three Fiber
            </Link>
          </div>

          <div className="row-span-full col-[4/6] max-w-lg flex flex-col gap-2 py-8"></div>
        </div>
      </motion.section>
    );
  },
);

export default AboutContent;
