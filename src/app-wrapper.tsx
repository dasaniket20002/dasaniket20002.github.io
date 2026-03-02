import ReactLenis, { type LenisRef } from "lenis/react";
import { cancelFrame, frame, LazyMotion, type FrameData } from "motion/react";
import { useEffect, useRef } from "react";
import App from "./App.tsx";
import { CloudSimProvider } from "./lib/components/cloud-metaballs/cloud-sim-provider.tsx";
import { PerformanceMetricsProvider } from "./lib/contexts/performance-metrics-provider.tsx";
import { StickySnapProvider } from "./lib/contexts/sticky-snap-provider.tsx";
import ToastProvider from "./lib/contexts/toast-provider.tsx";

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
        infinite: true,
        lerp: 0.25,
        overscroll: false,
        wheelMultiplier: 1.1,
      }}
      ref={lenisRef}
    >
      <LazyMotion features={loadFeatures} strict>
        <PerformanceMetricsProvider>
          <StickySnapProvider>
            <ToastProvider>
              <CloudSimProvider>
                <App />
              </CloudSimProvider>
            </ToastProvider>
          </StickySnapProvider>
        </PerformanceMetricsProvider>
      </LazyMotion>
    </ReactLenis>
  );
}
