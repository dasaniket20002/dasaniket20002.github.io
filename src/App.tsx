import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Header from "./lib/components/header";
import Loader from "./lib/components/loader";
import NoiseOverlay from "./lib/components/noise-overlay";
import Hero from "./lib/pages/hero";
import Work from "./lib/pages/work";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
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
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
