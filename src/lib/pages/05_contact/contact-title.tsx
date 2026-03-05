import { lazy, Suspense, useEffect, useRef } from "react";
import ScrollTextPressure from "../../components/scroll-text-pressure";
import { cn } from "../../utils";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { useInView } from "motion/react";

const PortalBox = lazy(() => import("../../components/portal-box/PortalBox"));

const DISPLAY = "/ GREAT DESIGN\n STARTS WITH,\n GREAT COLLABORATION. /";
const HIGHLIGHTS = ["DESIGN", "COLLABORATION"];

export default function ContactTitle({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();
  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  const inView = useInView(containerRef, { margin: "-128px" });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-[150dvh] py-16 px-16 md:px-32 bg-dark-d",
        className,
      )}
    >
      <ScrollTextPressure
        displayText={DISPLAY}
        highlights={HIGHLIGHTS}
        containerRef={containerRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "128px" }}
        className="h-min px-0"
        theme="dark"
      />
      <div className="sticky bottom-0 left-full w-full md:w-1/2 aspect-square">
        <Suspense fallback={null}>
          <PortalBox inView={inView} theme="dark" />
        </Suspense>
      </div>
    </div>
  );
}
