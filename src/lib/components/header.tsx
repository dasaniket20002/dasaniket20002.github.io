import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  motion,
  stagger,
  // useMotionValueEvent,
  // useScroll,
  type Variants,
} from "motion/react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useBGTheme } from "../hooks/use-bg-theme";
import { useStickySnap } from "../hooks/use-sticky-snap";
import { cn } from "../utils";
import Link from "./link";
import LogoName from "./logo-name";

type HeaderProps = { className?: string };

const LINK_VARIANTS: Variants = {
  hidden: { y: -24, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const CONTAINER_VARIANTS: Variants = {
  hidden: { transition: { delayChildren: stagger(0.05, { from: 1 }) } },
  visible: { transition: { delayChildren: stagger(0.05, { from: -1 }) } },
};

const NAV_LINKS = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const HEADER_INITIAL_DELAY = 1500;

const Header = forwardRef<HTMLElement, HeaderProps>(({ className }, ref) => {
  const headerRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(true);
  const bgTheme = useBGTheme(headerRef);
  // const { scrollY } = useScroll();

  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   const previous = scrollY.getPrevious() ?? 0;
  //   if (latest - previous > 10) setHidden(true);
  //   if (previous - latest > 5) setHidden(false);
  // });

  const { lockSnap, unlockSnap } = useStickySnap();
  const lenis = useLenis();

  useEffect(() => {
    const t = setTimeout(() => setHidden(false), HEADER_INITIAL_DELAY);

    return () => {
      if (t) clearTimeout(t);
    };
  }, []);

  useImperativeHandle(ref, () => headerRef.current!);

  return (
    <header
      ref={headerRef}
      className={cn(
        "px-4 md:px-16 h-(--header-height) flex gap-4 md:gap-8 justify-between items-center z-98",
        className,
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
              "text-lg md:text-xl cursor-pointer transition-colors z-98",
              bgTheme === "light" ? "text-dark-1" : "text-light-2",
            )}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              lockSnap();
              lenis?.scrollTo("#top", { onComplete: unlockSnap });
            }}
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
              bgTheme === "light" ? "text-dark-1" : "text-light-2",
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
