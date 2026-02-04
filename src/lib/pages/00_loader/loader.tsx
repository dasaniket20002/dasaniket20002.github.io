import { motion } from "motion/react";
import { forwardRef } from "react";
import LogoName from "../../components/logo-name";
import Counter from "./counter";
import Message from "./message";

type LoaderProps = { onComplete: () => void };

const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ onComplete }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "backOut" }}
        className="relative h-screen z-98 overflow-hidden flex justify-between py-8 px-16 cursor-progres"
      >
        <LogoName
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="text-7xl text-light-2 w-min self-start flex-none"
        />

        <div className="flex-1 h-full flex flex-col justify-between">
          <div className="relative size-full place-items-end">
            <Counter
              onComplete={onComplete}
              className="font-think-loved text-9xl text-dark-1"
            />
          </div>
          <Message className="text-light-2 text-end w-full" />
        </div>
      </motion.div>
    );
  },
);

export default Loader;
