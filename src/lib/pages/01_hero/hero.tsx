import { useInView, useMotionValue } from "motion/react";
import { useRef } from "react";
import { useStickySnap } from "../../hooks/use-sticky-snap";
import { cn } from "../../utils";
import HeroCanvas from "../../components/hero-canvas/hero-canvas";

export default function Hero({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();
  const inView = useInView(containerRef, { amount: "some" });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  return (
    <div
      ref={(r) => {
        containerRef.current = r;
        registerSection(r);
      }}
      data-bg-theme="dark"
      id="hero"
      className={cn(
        "h-dvh w-full relative",
        "grid",
        "grid-cols-[4rem_1fr_1fr_1fr_1fr_4rem] grid-rows-[8rem_1fr_1fr_1fr_8rem]",
        "md:grid-cols-[8rem_1fr_1fr_1fr_1fr_8rem] md:grid-rows-[8rem_1fr_1fr_1fr_8rem]",
        "bg-radial-[at_0%_0%] from-[color-mix(in_oklab,var(--color-dark-d)_90%,white)] via-dark-d to-dark-d bg-contain",
        className,
      )}
    >
      {inView && (
        <>
          <div className="size-full row-span-full col-span-full mask-b-from-80% mask-t-from-80% mask-l-from-80% mask-r-from-80%">
            <HeroCanvas
              eventSource={eventSourceRef}
              pointerX={pointerX}
              pointerY={pointerY}
            />
          </div>
          <div
            ref={eventSourceRef}
            onPointerMove={(e) => {
              pointerX.set(e.clientX);
              pointerY.set(e.clientY);
            }}
            className="size-full row-span-full col-span-full p-16 z-1"
          ></div>
        </>
      )}
    </div>
  );
}
