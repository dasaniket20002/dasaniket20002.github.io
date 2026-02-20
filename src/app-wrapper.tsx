import App from "./App.tsx";
import ReactLenis, { type LenisRef } from "lenis/react";
import { cancelFrame, frame, LazyMotion, type FrameData } from "motion/react";
import { StickySnapProvider } from "./lib/contexts/sticky-snap-provider.tsx";
import { useEffect, useRef } from "react";
import { PerformanceMetricsProvider } from "./lib/contexts/performance-metrics-provider.tsx";

const loadFeatures = () => import("./lib/features").then((res) => res.default);

export default function AppWrapper() {
  const lenisRef = useRef<LenisRef>(null);
  useEffect(() => {
    function update({ timestamp }: FrameData) {
      lenisRef.current?.lenis?.raf(timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        syncTouch: true,
        // infinite: true,
      }}
      ref={lenisRef}
    >
      <LazyMotion features={loadFeatures} strict>
        <PerformanceMetricsProvider>
          <StickySnapProvider>
            <App />
          </StickySnapProvider>
        </PerformanceMetricsProvider>
      </LazyMotion>
    </ReactLenis>
  );
}
