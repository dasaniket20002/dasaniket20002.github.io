import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import React, { useState } from "react";
import Header from "./lib/components/header";
import NoiseOverlay from "./lib/components/noise-overlay";
import Loader from "./lib/pages/00_loader/loader";
import Hero from "./lib/pages/01_hero/hero";
import Work from "./lib/pages/02_work/work";
import Services from "./lib/pages/03_services/services";
import About from "./lib/pages/04_about/about";
import Contact from "./lib/pages/05_contact/contact";
import Footer from "./lib/pages/06_footer/footer";

export const HEADER_HEIGHT = 40;
export const SECTION_HEADER_HEIGHT = 96;
export const MIN_SECTION_HEADER_HEIGHT = 48;

export const DEBUG_HIDE_SKETCHES = false;
const RENDER_SOLO = false;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <NoiseOverlay />
      {RENDER_SOLO ? (
        <></>
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
              <Footer />
            </m.main>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export default App;
