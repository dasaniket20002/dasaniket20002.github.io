import { useEffect, useState } from "react";

export function useElementSize<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
): { width: number; height: number } {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setContainerSize({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight,
        });
      });
    });

    observer.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ref]);

  return containerSize;
}
