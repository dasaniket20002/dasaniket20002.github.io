import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { lazy, useState } from "react";
import NoiseOverlay from "./lib/components/noise-overlay";

const Loader = lazy(() => import("./lib/pages/00_loader/loader"));
const Header = lazy(() => import("./lib/components/header"));

const Hero = lazy(() => import("./lib/pages/01_hero/hero"));
const Work = lazy(() => import("./lib/pages/02_work/work"));
const Services = lazy(() => import("./lib/pages/03_services/services"));

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
              <Work />
              <Services />
              <div className="h-[200dvh]"></div>
              <Hero />
            </m.main>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export default App;
