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
        className="relative h-dvh z-98 overflow-hidden flex flex-col gap-12 md:flex-row md:justify-between py-8 px-16 cursor-progres"
      >
        <div className="md:flex-1 w-full">
          <LogoName
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="text-8xl text-light-2 w-min self-start flex-none"
          />
          <Message className="text-light-2 w-full px-[1.5em] font-semibold font-width-110 text-3xl" />
        </div>

        <div className="relative w-full place-items-end flex-1 md:my-[1.5em]">
          <Counter
            onComplete={onComplete}
            className="font-black font-width-125 tracking-tighter tabular-nums text-9xl text-dark-1"
          />
        </div>
      </m.div>
    );
  },
);

export default Loader;
