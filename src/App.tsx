import { AnimatePresence, cancelFrame, frame, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Header from "./lib/components/header";
import Loader from "./lib/components/loader";
import NoiseOverlay from "./lib/components/noise-overlay";
import About from "./lib/pages/about";
import Contact from "./lib/pages/contact";
import Hero from "./lib/pages/hero";
import Services from "./lib/pages/services";
import Work from "./lib/pages/work";
import { ReactLenis, type LenisRef } from "lenis/react";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const lenisRef = useRef<LenisRef>(null);
  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <NoiseOverlay />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeIn" }}
            className="relative h-full bg-light-1"
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
    </ReactLenis>
  );
}

export default App;
