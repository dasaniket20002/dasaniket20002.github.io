import { motion } from "motion/react";
import ScrollVelocity from "../../components/scroll-velocity";

export function BottomMarquee() {
  return (
    <motion.div
      layout
      className="w-full mt-auto place-self-end justify-self-end self-end flex-none"
      initial={{ opacity: 0, clipPath: "inset(0 50% 0 50%)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0%)" }}
      transition={{ delay: 1.1, ease: "easeInOut" }}
    >
      <ScrollVelocity
        texts={[
          <span className="px-6 py-2 space-x-12">
            <span className="tracking-wide">
              Available for collaboration at&nbsp;
              <a href="#" className="font-normal">
                dasaniket20002@gmail.com
              </a>
            </span>
            <span>\</span>
          </span>,
          <span className="px-6 py-2 space-x-12">
            <span className="tracking-wider font-extralight">Scroll Down</span>
            <span>\</span>
          </span>,
        ]}
        velocity={30}
        numCopies={12}
        className="text-sm font-helvetica font-light text-dark-1"
        containerClassName="pt-4 pb-1"
      />
    </motion.div>
  );
}
