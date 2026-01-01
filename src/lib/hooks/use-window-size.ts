import { useEffect, useState } from "react";

export function useWindowSize() {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    let frame = 0;

    const handleResize = () => {
      // Throttle updates to the next animation frame
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setWindowSize(getSize()));
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
    // Intentionally run effect only once on mount
  }, []);

  return windowSize;
}
