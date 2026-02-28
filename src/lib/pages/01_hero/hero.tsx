import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { lazy, Suspense, useEffect, useRef } from "react";
import Link from "../../components/link";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { cn } from "../../utils";
import HeroCTA from "./hero-cta";
import HeroSkillsList from "./hero-skills-list";
import HeroTagLine from "./hero-tag-line";

const ComputerScene = lazy(
  () => import("../../components/computers/computers-scene"),
);

export default function Hero({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();
  const inView = useInView(containerRef, { amount: "some" });

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  return (
    <div
      ref={containerRef}
      data-bg-theme="dark"
      id="hero"
      className={cn(
        "h-dvh w-full relative",
        "grid grid-rows-[1fr_1fr_4rem]",
        "grid-cols-[4rem_1fr_1fr_1fr_1fr_4rem]",
        "md:grid-cols-[8rem_1fr_1fr_1fr_1fr_8rem]",
        "bg-radial-[at_0%_0%] from-[color-mix(in_oklab,var(--color-dark-d)_90%,white)] via-dark-d to-dark-d",
        className,
      )}
    >
      <div className="size-full row-span-full col-span-full mask-b-from-90% mask-t-from-90% mask-l-from-90% mask-r-from-90%">
        <Suspense fallback={null}>
          <ComputerScene inView={inView} eventSource={containerRef} />
        </Suspense>
      </div>
      <div className="size-full row-span-full col-[2/-2] pt-32 z-1 grid grid-rows-subgrid grid-cols-subgrid">
        <div className="col-span-full row-[1/2] size-full flex flex-col gap-2 justify-center">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5, ease: "easeInOut" }}
            className="w-min text-sm border-dark-l border flex gap-4 items-center text-light-d py-3 pl-3 pr-4 rounded-full bg-dark-d/50 -ml-3"
          >
            <span className="relative h-2.5 aspect-square rounded-full bg-success before:absolute before:inset-0 before:bg-success before:blur-sm" />
            <p className="whitespace-nowrap trim-text-caps tracking-wider">
              Available for collaboration
            </p>
          </m.div>
          <HeroTagLine />
        </div>
        <HeroSkillsList
          className="col-[3/5] row-[2/3] place-items-end pt-24 md:pt-0"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
        />
        <HeroCTA
          className="col-[1/4] row-[2/3]"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
        />
        <div className="col-[4/5] row-[3/4] flex justify-end items-center py-2">
          <Link
            href={"https://earth.google.com/web/search/Kolkata,+West+Bengal"}
            showBG={false}
            className="overflow-hidden row-[1/2] col-[5/6] text-base text-light-d tracking-wide uppercase trim-text-caps w-min"
            initial={{ y: 24, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ delay: 0.6, ease: "easeInOut" }}
          >
            Kolkata
          </Link>
          <p className="text-light-d tracking-wide trim-text-caps mb-2">.</p>
          <Link
            href={"https://earth.google.com/web/search/India"}
            showBG={false}
            className="overflow-hidden row-[1/2] col-[6/7] text-base text-light-d tracking-wide uppercase trim-text-caps w-min"
            initial={{ y: 24, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ delay: 0.5, ease: "easeInOut" }}
          >
            India
          </Link>
        </div>
      </div>

      <div className="col-[2/4] row-[3/4] size-full flex items-center gap-3">
        <span className="h-px flex-3 bg-light-d" />
        <span className="h-px flex-2 bg-light-d" />
        <span className="text-light-d uppercase text-base trim-text-caps whitespace-nowrap">
          scroll down
        </span>
      </div>

      <div className="col-[5/6] row-[1/2] h-32 flex flex-col items-end gap-3 mt-48">
        <span className="w-px flex-4 bg-light-d" />
        <span className="w-px flex-3 bg-light-d" />
        <span className="w-px flex-2 bg-light-d" />
        <span className="w-px flex-1 bg-light-d" />
      </div>
    </div>
  );
}
