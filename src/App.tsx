import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { lazy, Suspense, useState } from "react";
import NoiseOverlay from "./lib/components/noise-overlay";

const Loader = lazy(() => import("./lib/pages/00_loader/loader"));
const Header = lazy(() => import("./lib/components/header"));

const Hero = lazy(() => import("./lib/pages/01_hero/hero"));
const Work = lazy(() => import("./lib/pages/02_work/work"));
const Services = lazy(() => import("./lib/pages/03_services/services"));
const About = lazy(() => import("./lib/pages/04_about/about"));
const Contact = lazy(() => import("./lib/pages/05_contact/contact"));
const Footer = lazy(() => import("./lib/pages/06_footer/footer"));

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
            <Suspense fallback={null}>
              <Loader key="loader" onComplete={() => setIsLoading(false)} />
            </Suspense>
          ) : (
            <m.main
              id="top"
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="relative h-full"
            >
              <Header className="fixed top-0" />
              <Suspense fallback={null}>
                <Hero />
              </Suspense>
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
              <Suspense fallback={null}>
                <Hero />
              </Suspense>
            </m.main>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export default App;
