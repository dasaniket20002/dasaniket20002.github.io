import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "../utils";
import Link from "./link";
import LogoName from "./logo-name";

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

const HEADER_INITIAL_DELAY = 1500;

export default function Header({ className }: { className?: string }) {
  const [hidden, setHidden] = useState(true);
  const [bgTheme, setBGTheme] = useState<"light" | "dark">("dark");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest - previous > 10) setHidden(true);
    if (previous - latest > 5) setHidden(false);
  });

  useAnimationFrame(() => {
    const elementsWithBGTheme = document.querySelectorAll("[data-bg-theme]");
    const header = document.getElementById("header");

    if (elementsWithBGTheme.length <= 0 || !header) return;

    const headerBounds = header.getBoundingClientRect();

    elementsWithBGTheme.forEach((element) => {
      const sectionBounds = element.getBoundingClientRect();
      if (
        !(
          headerBounds.right < sectionBounds.left ||
          headerBounds.left > sectionBounds.right ||
          headerBounds.bottom < sectionBounds.top ||
          headerBounds.top > sectionBounds.bottom
        )
      ) {
        const bgTheme = element.getAttribute("data-bg-theme");
        if (bgTheme === "light" || bgTheme === "dark") {
          setBGTheme(bgTheme);
        }
      }
    });
  });

  useEffect(() => {
    const t = setTimeout(() => setHidden(false), HEADER_INITIAL_DELAY);

    return () => {
      if (t) clearTimeout(t);
    };
  }, []);

  return (
    <header
      id="header"
      className={cn(
        "px-4 md:px-8 h-header flex gap-4 md:gap-8 justify-between items-center",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {!hidden && (
          <LogoName
            className={cn(
              "text-lg md:text-xl cursor-pointer transition-colors",
              bgTheme === "light" ? "text-dark-1" : "text-light-2"
            )}
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
            className={cn(
              "flex gap-4 md:gap-8 items-center text-sm md:text-base font-helvetica font-light transition-colors",
              bgTheme === "light" ? "text-dark-1" : "text-light-2"
            )}
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
