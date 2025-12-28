import NoiseOverlay from "./lib/components/noise-overlay";
import Loader from "./lib/components/loader";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Header from "./lib/components/header";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hideHeader, setHideHeader] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 80) {
      setHideHeader(true);
    } else if (latest < previous) {
      setHideHeader(false);
    }
  });
  return (
    <>
      <NoiseOverlay />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeOut" }}
            className="relative min-h-screen h-full w-full bg-light-1 flex flex-col"
          >
            <Header className="sticky top-0" hidden={hideHeader} />
            <main className="h-page place-items-center place-content-center">
              <p>TODO Main Content here</p>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
