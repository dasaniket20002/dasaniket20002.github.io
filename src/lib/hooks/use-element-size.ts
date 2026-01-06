import { useEffect, useState } from "react";

export function useElementSize<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): { width: number; height: number } {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const getSize = () => {
      if (!ref.current) return { width: 0, height: 0 };
      return {
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      };
    };

    let frame = 0;

    const handleResize = () => {
      // Throttle updates to the next animation frame
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setContainerSize(getSize()));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Initialize size
    handleResize();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [ref]);

  return containerSize;
}
