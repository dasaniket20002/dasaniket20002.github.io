import { ReactLenis, type LenisRef } from "lenis/react";
import {
  AnimatePresence,
  cancelFrame,
  frame,
  type FrameData,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import Header from "./lib/components/header";
import NoiseOverlay from "./lib/components/noise-overlay";
import { StickySnapProvider } from "./lib/contexts/sticky-snap-provider";
import Loader from "./lib/pages/00_loader/loader";
import Hero from "./lib/pages/01_hero/hero";
import Work from "./lib/pages/02_work/work";
import Services from "./lib/pages/03_services/services";
import About from "./lib/pages/04_about/about";
import Contact from "./lib/pages/05_contact/contact";
import { LazyMotion } from "motion/react";

// Make sure to return the specific export containing the feature bundle.
const loadFeatures = () => import("./lib/features").then((res) => res.default);

export const HEADER_HEIGHT = 40;
export const SECTION_HEADER_HEIGHT = 108;
export const MIN_SECTION_HEADER_HEIGHT = 72;

export const DEBUG_HIDE_SKETCHES = false;
const RENDER_SOLO = false;

function App() {
  const [isLoading, setIsLoading] = useState(true);
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
      }}
      ref={lenisRef}
    >
      <LazyMotion features={loadFeatures} strict>
        <StickySnapProvider>
          <NoiseOverlay />
          {RENDER_SOLO ? (
            <>
              {/* <div className="relative h-screen bg-linear-to-b from-[color-mix(in_oklch,var(--color-light-2),black_10%)] to-light-1">
              <FloatingBalloon />
            </div>
            <div className="relative h-screen"></div> */}
            </>
          ) : (
            <AnimatePresence mode="wait">
              {isLoading ? (
                <Loader key="loader" onComplete={() => setIsLoading(false)} />
              ) : (
                <m.main
                  id="top"
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ ease: "easeIn" }}
                  className="relative h-full bg-light-1"
                  style={
                    {
                      "--header-height": `${HEADER_HEIGHT}px`,
                      "--section-header-height": `${SECTION_HEADER_HEIGHT}px`,
                      "--min-section-header-height": `${MIN_SECTION_HEADER_HEIGHT}px`,
                    } as React.CSSProperties
                  }
                >
                  <Header className="w-full sticky top-0" />
                  <Hero />
                  <Work />
                  <Services />
                  <About />
                  <Contact />
                </m.main>
              )}
            </AnimatePresence>
          )}
        </StickySnapProvider>
      </LazyMotion>
    </ReactLenis>
  );
}

export default App;
