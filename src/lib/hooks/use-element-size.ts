import { useLayoutEffect, useState } from "react";

export function useElementSize<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): { width: number; height: number } {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    function updateSize() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
        setHeight(ref.current.offsetHeight);
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [ref]);

  return { width, height };
}
