import { useRef } from "react";
import { cn } from "../utils";
import { useElementSize } from "../hooks/use-element-size";

export default function About({ className }: { className?: string }) {
  const headRef = useRef<HTMLDivElement>(null);
  const { height: headHeight } = useElementSize(headRef);
  return (
    <div className={cn("min-h-screen w-full relative", className)}>
      <div
        ref={headRef}
        data-bg-theme="light"
        className="bg-light-1 flex justify-between items-end px-4 md:px-16 font-think-loved sticky top-0 pt-page"
      >
        <h2 className="text-light-2 text-5xl trim-text-caps">dg/03</h2>
        <h1 className="text-dark-2 text-8xl trim-text-caps">about</h1>
      </div>
      <div
        className="bg-dark-2 h-[calc(100vh-var(--head-height))]"
        style={{ "--head-height": `${headHeight}px` } as React.CSSProperties}
      ></div>
      <div
        className={cn("bg-dark-2 h-[calc(100vh-var(--head-height))]")}
        style={{ "--head-height": `${headHeight}px` } as React.CSSProperties}
      ></div>
    </div>
  );
}
