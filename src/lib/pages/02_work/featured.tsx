import {
  AnimatePresence,
  motion,
  useInView,
  type HTMLMotionProps,
} from "motion/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import InfiniteMenuP5 from "../../components/infinite-menu-p5";
import { cn } from "../../utils";

// const items = [
//   {
//     image: "https://picsum.photos/seed/menu1/512/512",
//     link: "#nature",
//     title: "Nature",
//     description: "Explore the wilderness",
//   },
//   {
//     image: "https://picsum.photos/seed/menu2/512/512",
//     link: "#urban",
//     title: "Urban",
//     description: "City life vibes",
//   },
//   {
//     image: "https://picsum.photos/seed/menu3/512/512",
//     link: "#abstract",
//     title: "Abstract",
//     description: "Modern art forms",
//   },
//   {
//     image: "https://picsum.photos/seed/menu4/512/512",
//     link: "#ocean",
//     title: "Ocean",
//     description: "Deep sea wonders",
//   },
//   {
//     image: "https://picsum.photos/seed/menu5/512/512",
//     link: "#mountains",
//     title: "Mountains",
//     description: "Peak adventures",
//   },
//   {
//     image: "https://picsum.photos/seed/menu6/512/512",
//     link: "#desert",
//     title: "Desert",
//     description: "Sandy horizons",
//   },
//   {
//     image: "https://picsum.photos/seed/menu7/512/512",
//     link: "#forest",
//     title: "Forest",
//     description: "Green canopy",
//   },
//   {
//     image: "https://picsum.photos/seed/menu8/512/512",
//     link: "https://example.com",
//     title: "Space",
//     description: "Cosmic journey",
//   },
// ];

const Featured = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  const containerRef = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => containerRef.current as HTMLElement);

  const inView = useInView(containerRef, {
    margin: "-50% 0% -50% 0%",
  });

  return (
    <motion.section
      ref={containerRef}
      {...motionProps}
      className={cn(
        "relative h-[calc(100vh-var(---min-section-header-height))] md:h-[calc(100vh-var(--section-header-height))] cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {inView && (
          <InfiniteMenuP5
            scale={0.75}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ ease: "easeIn", duration: 1 }}
            className="mask-t-from-128"
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
});

export default Featured;
