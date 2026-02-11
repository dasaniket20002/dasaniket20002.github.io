import * as m from "motion/react-m";
import { forwardRef } from "react";
import LogoName from "../../components/logo-name";
import Counter from "./counter";
import Message from "./message";

type LoaderProps = { onComplete: () => void };

const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ onComplete }, ref) => {
    return (
      <m.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "backOut" }}
        className="relative h-dvh z-98 overflow-hidden flex justify-between py-8 px-16 cursor-progres"
      >
        <div className="flex-1 size-full flex flex-col">
          <LogoName
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="text-7xl text-light-2 w-min self-start flex-none"
          />
          <Message className="text-light-2 w-full p-[2em] font-semibold font-width-110 text-xl" />
        </div>

        <div className="relative size-full place-items-end flex-1">
          <Counter
            onComplete={onComplete}
            className="font-think-loved text-9xl text-dark-1"
          />
        </div>
      </m.div>
    );
  },
);

export default Loader;
