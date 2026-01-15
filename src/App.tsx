import { ReactLenis, type LenisRef } from "lenis/react";
import {
  AnimatePresence,
  cancelFrame,
  frame,
  motion,
  type FrameData,
} from "motion/react";
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

export const HEADER_HEIGHT = 40;
export const SECTION_HEADER_HEIGHT = 108;
export const MIN_SECTION_HEADER_HEIGHT = 72;

function App() {
  const [isLoading, setIsLoading] = useState(false);
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
      <StickySnapProvider>
        <NoiseOverlay />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Loader key="loader" onComplete={() => setIsLoading(false)} />
          ) : (
            <motion.main
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
            </motion.main>
          )}
        </AnimatePresence>
      </StickySnapProvider>
    </ReactLenis>
  );
}

export default App;
