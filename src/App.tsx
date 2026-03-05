import { AnimatePresence } from "motion/react";
import { lazy, Suspense, useEffect, useState } from "react";
import Header from "./lib/components/ui/header";
import NoiseOverlay from "./lib/components/ui/noise-overlay";
import { useStickySnap } from "./lib/contexts/use-sticky-snap";
import Loader from "./lib/pages/00_loader/loader";
import Hero from "./lib/pages/01_hero/hero";

// const Hero = lazy(() => import("./lib/pages/01_hero/hero"));
const Work = lazy(() => import("./lib/pages/02_work/work"));
const Services = lazy(() => import("./lib/pages/03_services/services"));
const About = lazy(() => import("./lib/pages/04_about/about"));
const Contact = lazy(() => import("./lib/pages/05_contact/contact"));
const Footer = lazy(() => import("./lib/pages/06_footer/footer"));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { lockScroll, unlockScroll } = useStickySnap();
  useEffect(() => {
    lockScroll();
  }, [lockScroll]);

  return (
    <>
      <NoiseOverlay />
      <main id="top" className="relative h-full w-full">
        <AnimatePresence mode="wait">
          {isLoading && (
            <Loader
              key="loader"
              onComplete={() => {
                setIsLoading(false);
                unlockScroll();
              }}
            />
          )}
        </AnimatePresence>
        <Header className="fixed top-0 left-0 right-0" isLoading={isLoading} />
        <Hero id="hero" isLoading={isLoading} />

        <Suspense fallback={null}>
          <Work />
        </Suspense>
        <Suspense fallback={null}>
          <Services />
        </Suspense>
        <Suspense fallback={null}>
          <About />
        </Suspense>
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        <Hero isLoading={isLoading} />
      </main>
    </>
  );
}

export default App;
