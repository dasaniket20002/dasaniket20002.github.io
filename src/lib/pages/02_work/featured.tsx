import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import InfiniteMenuP5 from "../../components/infinite-menu-p5";
import { cn } from "../../utils";

const Featured = forwardRef<
  HTMLElement,
  { className?: string } & HTMLMotionProps<"section">
>(({ className, ...motionProps }, ref) => {
  const containerRef = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => containerRef.current as HTMLElement);

  const inView = useInView(containerRef, { margin: "-50% 0% -50% 0%" });

  return (
    <motion.section
      ref={containerRef}
      {...motionProps}
      className={cn("relative cursor-grab active:cursor-grabbing", className)}
    >
      <InfiniteMenuP5
        scale={0.75}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.8 }}
        transition={{ ease: "anticipate", duration: 1 }}
        className="mask-t-from-128"
      />
    </motion.section>
  );
});

export default Featured;
