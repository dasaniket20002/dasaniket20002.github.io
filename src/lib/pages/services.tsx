import { useRef } from "react";
import { cn } from "../utils";
import { useElementSize } from "../hooks/use-element-size";

export default function Services({ className }: { className?: string }) {
  const headRef = useRef<HTMLDivElement>(null);
  const { height: headHeight } = useElementSize(headRef);
  return (
    <div className={cn("min-h-screen w-full relative", className)}>
      <div
        ref={headRef}
        data-bg-theme="dark"
        className="bg-dark-2 flex justify-between items-end px-4 md:px-16 font-think-loved sticky top-0 pt-page"
      >
        <h2 className="text-dark-1 text-5xl trim-text-caps">dg/02</h2>
        <h1 className="text-light-1 text-8xl trim-text-caps">services</h1>
      </div>
      <div
        className="bg-light-1 h-[calc(100vh-var(--head-height))]"
        style={{ "--head-height": `${headHeight}px` } as React.CSSProperties}
      ></div>
      <div
        className={cn("bg-light-1 h-[calc(100vh-var(--head-height))]")}
        style={{ "--head-height": `${headHeight}px` } as React.CSSProperties}
      ></div>
    </div>
  );
}
