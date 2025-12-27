import NoiseOverlay from "./lib/components/noise-overlay";
import Loader from "./lib/components/loader";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LogoName from "./lib/components/logo-name";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="relative min-h-screen w-full bg-light-1">
      <NoiseOverlay />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-screen place-content-center place-items-center"
          >
            <LogoName className="text-8xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
