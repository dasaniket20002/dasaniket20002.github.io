import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  stagger,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "motion/react";
import * as m from "motion/react-m";
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
  hidden: { x: 24, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const CONTAINER_VARIANTS: Variants = {
  hidden: { transition: { delayChildren: stagger(0.1, { from: 1 }) } },
  visible: { transition: { delayChildren: stagger(0.1, { from: -1 }) } },
};

const NAV_LINKS = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const HEADER_INITIAL_DELAY = 1000;
const REVEAL_TRANSITION_DURATION = 0.25;

const Header = forwardRef<HTMLElement, HeaderProps>(({ className }, ref) => {
  const headerRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(true);
  const bgTheme = useBGTheme(headerRef);

  const { lockSnap, unlockSnap } = useStickySnap();
  const lenis = useLenis();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest - previous > 10) setHidden(true);
    if (previous - latest > 5) setHidden(false);
  });

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
        "px-16 md:px-32 py-3 w-full flex gap-4 md:gap-8 justify-between items-start z-98",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {!hidden && (
          <LogoName
            className={cn(
              "text-xl cursor-pointer transition-colors z-98",
              bgTheme === "light" ? "text-dark-d" : "text-light-l",
            )}
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{
              duration: REVEAL_TRANSITION_DURATION,
              ease: "easeInOut",
            }}
            onClick={(e) => {
              e.preventDefault();
              lockSnap();
              lenis?.scrollTo(0, { onComplete: unlockSnap, lock: true });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!hidden && (
          <m.nav
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              "flex flex-col gap-1.5 items-end tracking-wide font-width-110 font-light transition-colors",
              bgTheme === "light" ? "text-dark-d" : "text-light-l",
            )}
          >
            {NAV_LINKS.map((l, i) => (
              <m.section
                key={i}
                variants={LINK_VARIANTS}
                transition={{
                  duration: REVEAL_TRANSITION_DURATION,
                  ease: "easeInOut",
                }}
              >
                <Link href={l.href} children={l.name} theme={bgTheme} />
              </m.section>
            ))}
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
