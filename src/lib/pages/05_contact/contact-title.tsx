import { useEffect, useRef } from "react";
import ScrollTextPressure from "../../components/scroll-text-pressure";
import { cn } from "../../utils";
import { useStickySnap } from "../../contexts/use-sticky-snap";

const DISPLAY = "/ GREAT DESIGN\n STARTS WITH,\n GREAT COLLABORATION. /";
const HIGHLIGHTS = ["DESIGN", "COLLABORATION"];

export default function ContactTitle({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();
  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[200dvh] py-16 px-16 md:px-32", className)}
    >
      <ScrollTextPressure
        displayText={DISPLAY}
        highlights={HIGHLIGHTS}
        containerRef={containerRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "128px" }}
        className="h-min px-0"
      />
    </div>
  );
}
