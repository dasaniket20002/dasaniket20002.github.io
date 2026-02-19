import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";
import Header from "./lib/components/header";
import NoiseOverlay from "./lib/components/noise-overlay";
import Loader from "./lib/pages/00_loader/loader";
import Hero from "./lib/pages/01_hero/hero";

const RENDER_SOLO = false;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <NoiseOverlay />
      {RENDER_SOLO ? (
        <></>
      ) : (
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <Loader key="loader" onComplete={() => setIsLoading(false)} />
          ) : (
            <m.main
              id="top"
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="relative h-full"
            >
              <Header className="fixed top-0" />
              <Hero />
              <div className="h-dvh"></div>
            </m.main>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export default App;
