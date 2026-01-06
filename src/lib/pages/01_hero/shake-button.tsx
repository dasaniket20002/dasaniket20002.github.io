import { motion } from "motion/react";
import type { ShakeOptions } from "../../hooks/use-screen-shake";

export function ShakeButton({ shake }: { shake: (p?: ShakeOptions) => void }) {
  return (
    <motion.button
      className="absolute top-0 left-1/2 -translate-x-1/2 z-3 cursor-pointer"
      initial={{ scale: 1.8, rotate: "0deg", opacity: 0 }}
      animate={{ scale: 1, rotate: ["0deg", "360deg"], opacity: 1 }}
      whileHover={{
        scale: [1, 1.5, 1.2],
        rotate: "0deg",
        transition: { scale: { duration: 0.4 } },
      }}
      whileTap={{
        scale: [1, 0.5, 1],
        rotate: "0deg",
        transition: { scale: { duration: 0.2 } },
      }}
      transition={{
        default: { ease: "backOut", duration: 0.4, delay: 2.5 },
        rotate: {
          repeat: Infinity,
          repeatDelay: 2,
          repeatType: "loop",
          duration: 0.8,
          ease: "backOut",
          delay: 4.5,
        },
      }}
      onClick={() => shake()}
    >
      <motion.section className="size-6">
        <svg
          width="35"
          height="33"
          viewBox="0 0 35 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full stroke-dark-1 stroke-2"
        >
          <path
            d="M17.5001 1.5L20.0404 10.2958C20.3503 11.3691 20.5054 11.9057 20.8114 12.3444C21.0822 12.7326 21.4374 13.0635 21.8542 13.3159C22.325 13.601 22.901 13.7454 24.0531 14.0342L33.4941 16.4008L24.0522 18.7709C22.9 19.0601 22.3239 19.2048 21.853 19.49C21.4361 19.7425 21.0807 20.0736 20.8098 20.4619C20.5036 20.9007 20.3483 21.4374 20.0379 22.5109L17.494 31.3075L14.9537 22.5118C14.6438 21.4384 14.4887 20.9018 14.1827 20.4632C13.9118 20.0749 13.5566 19.7439 13.14 19.4916C12.6691 19.2066 12.0931 19.0621 10.941 18.7733L1.49999 16.4067L10.9419 14.0366C12.0941 13.7474 12.6702 13.6027 13.1412 13.3175C13.558 13.065 13.9133 12.7339 14.1843 12.3457C14.4905 11.9068 14.6458 11.3701 14.9562 10.2967L17.5001 1.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.section>
    </motion.button>
  );
}
