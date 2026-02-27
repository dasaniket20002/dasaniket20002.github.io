import { useEffect, useRef } from "react";
import { useStickySnap } from "../../contexts/use-sticky-snap";

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useStickySnap();

  useEffect(() => {
    registerSection(containerRef);
  }, [registerSection]);

  return (
    <div
      ref={containerRef}
      className="h-dvh w-full px-16 md:px-32 pt-16 flex flex-col gap-8"
    ></div>
  );
}
