import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  // useMotionValueEvent,
  // useScroll,
  type Variants,
} from "motion/react";
import { forwardRef, useEffect, useState } from "react";
import { cn } from "../utils";
import Link from "./link";
import LogoName from "./logo-name";

type HeaderProps = { className?: string };

const LINK_VARIANTS: Variants = {
  hidden: { y: -24, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const CONTAINER_VARIANTS: Variants = {
  hidden: { transition: { staggerChildren: 0.05, staggerDirection: 1 } },
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const NAV_LINKS = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const HEADER_INITIAL_DELAY = 1500;

const Header = forwardRef<HTMLElement, HeaderProps>(({ className }, ref) => {
  const [hidden, setHidden] = useState(true);
  const [bgTheme, setBGTheme] = useState<"light" | "dark">("dark");
  // const { scrollY } = useScroll();

  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   const previous = scrollY.getPrevious() ?? 0;
  //   if (latest - previous > 10) setHidden(true);
  //   if (previous - latest > 5) setHidden(false);
  // });

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
      ref={ref}
      id="header"
      className={cn(
        "px-4 md:px-16 h-header flex gap-4 md:gap-8 justify-between items-center z-9998",
        className
      )}
    >
      <motion.span
        className="absolute inset-0 bg-size-[4px_4px] backdrop-blur-xs mask-b-from-0 bg-[radial-gradient(transparent_1px,var(--header-bg)_1px)]"
        initial={false}
        animate={{
          "--header-bg":
            bgTheme === "light"
              ? "var(--color-light-1)"
              : "var(--color-dark-2)",
        }}
      />
      <AnimatePresence mode="wait">
        {!hidden && (
          <LogoName
            className={cn(
              "text-lg md:text-xl cursor-pointer transition-colors z-9998",
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
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              "flex gap-4 md:gap-8 items-center text-sm tracking-wide font-light transition-colors",
              bgTheme === "light" ? "text-dark-1" : "text-light-2"
            )}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.section key={i} variants={LINK_VARIANTS}>
                <Link href={l.href} text={l.name} theme={bgTheme} />
              </motion.section>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
