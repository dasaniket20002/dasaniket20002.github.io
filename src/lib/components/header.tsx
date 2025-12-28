import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "motion/react";
import { cn } from "../utils";
import Link from "./link";
import LogoName from "./logo-name";
import { useEffect, useState } from "react";

const linkVariants: Variants = {
  hidden: { y: -24, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -24, opacity: 0 },
};

const containerVariants: Variants = {
  hidden: { transition: { staggerChildren: 0.05, staggerDirection: 1 } },
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: 1 } },
};

const NAV_LINKS = [
  { name: "Work", href: "#" },
  { name: "Services", href: "#" },
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
];

export default function Header({ className }: { className?: string }) {
  const [hidden, setHidden] = useState(true);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 80) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setHidden(false);
    }, 1000);

    return () => {
      if (t) clearTimeout(t);
    };
  }, []);

  return (
    <header
      className={cn(
        "px-4 md:px-8 h-header flex gap-4 md:gap-8 justify-between items-center",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {!hidden && (
          <LogoName
            className="text-lg md:text-xl text-dark-1 cursor-pointer"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!hidden && (
          <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex gap-4 md:gap-8 items-center text-sm md:text-base font-helvetica text-dark-1 font-light"
          >
            {NAV_LINKS.map((l, i) => (
              <Link href={l.href} key={i} variants={linkVariants}>
                {l.name}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
