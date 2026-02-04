import { motion } from "motion/react";
import { forwardRef } from "react";
import Key from "../../components/key";
import LogoName from "../../components/logo-name";
import Counter from "./counter";
import Message from "./message";

type LoaderProps = { onComplete: () => void };

const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ onComplete }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="relative h-screen z-98 overflow-y-hidden grid grid-rows-3 py-8"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1, ease: "easeInOut" }}
      >
        <motion.div
          className="w-full place-items-center"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{
            duration: 1.2,
            type: "spring",
            ease: "backOut",
            delay: 0.9,
          }}
        >
          <LogoName className="text-2xl text-light-2" />
        </motion.div>

        <motion.div
          className="flex gap-8 items-center justify-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1,
            type: "spring",
            ease: "backOut",
            delay: 0.5,
          }}
        >
          <Key className="text-2xl size-16 sm:text-4xl sm:size-24 flex-none">
            a
          </Key>
          <div className="flex-1" />
          <Key className="text-2xl size-16 sm:text-4xl sm:size-24 flex-none">
            d
          </Key>
        </motion.div>

        <motion.div
          className="w-full px-8 py-4 space-y-1 place-self-end text-light-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{
            duration: 1.2,
            type: "spring",
            ease: "backOut",
            delay: 0.9,
          }}
        >
          <Counter onComplete={onComplete} />
          <Message />
        </motion.div>
      </motion.div>
    );
  },
);

export default Loader;
