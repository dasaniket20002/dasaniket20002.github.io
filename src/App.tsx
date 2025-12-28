import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Header from "./lib/components/header";
import Loader from "./lib/components/loader";
import NoiseOverlay from "./lib/components/noise-overlay";

function App() {
  const [isLoading, setIsLoading] = useState(true);

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
            className="relative min-h-screen h-full w-full bg-light-1"
          >
            <Header className="w-full sticky top-0" />
            <div className="h-[200vh] place-items-center place-content-center">
              <p>TODO Main Content here</p>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
