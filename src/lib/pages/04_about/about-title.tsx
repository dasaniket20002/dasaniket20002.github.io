import { useInView } from "motion/react";
import { lazy, Suspense, useEffect, useRef } from "react";
import ScrollTextPressure from "../../components/ui/scroll-text-pressure";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { cn } from "../../utils";

const PortalBox = lazy(
  () => import("../../components/r3f/portal-box/PortalBox"),
);

const DISPLAY =
  "/ DESIGN IS NOT\nJUST DECORATION,\nBUT A TOOL FOR EMOTION\nAND INFLUENCE. /";
const HIGHLIGHTS = ["DESIGN", "DECORATION", "EMOTION", "INFLUENCE"];

export default function AboutTitle({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();
  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  const inView = useInView(containerRef, { margin: "-128px" });

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[150dvh] py-16 px-16 md:px-32", className)}
    >
      <ScrollTextPressure
        displayText={DISPLAY}
        highlights={HIGHLIGHTS}
        containerRef={containerRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "128px" }}
        className="h-min px-0"
        theme="light"
      />
      <div className="sticky bottom-0 left-full w-full md:w-1/2 aspect-square">
        <Suspense fallback={null}>
          <PortalBox inView={inView} theme="light" />
        </Suspense>
      </div>
    </div>
  );
}
