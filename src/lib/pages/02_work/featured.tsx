import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";
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
>(({ className, ...motionProps }, forwardedRef) => {
  return (
    <motion.section
      ref={forwardedRef}
      {...motionProps}
      className={cn("relative h-[calc(100vh-var(--head-height))]", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ ease: "backOut", delay: 0.25, duration: 1 }}
      viewport={{ once: true, margin: "0% 0% -30% 0%" }}
    >
      <InfiniteMenuP5 scale={0.75} />
    </motion.section>
  );
});

export default Featured;
