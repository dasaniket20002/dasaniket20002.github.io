import { P5Canvas } from "@p5-wrapper/react";
import { IconLoader2 } from "@tabler/icons-react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useRef, useState } from "react";
import fragShader from "../components/shaders/sedimentary-groove-fs.glsl?raw";
import vertShader from "../components/shaders/sedimentary-groove-vs.glsl?raw";
import { useElementSize } from "../hooks/use-element-size";
import { cn } from "../utils";
import { sedimentaryGrooveSketch } from "./sketches/sedimentary-groove-sketch";

const SedimentaryGrooveP5 = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    containerClassName?: string;
  } & HTMLMotionProps<"div">
>(({ className, containerClassName, ...motionProps }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(containerRef);
  const [isLoading, setIsLoading] = useState(true);
  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      {...motionProps}
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        className={cn("size-full", containerClassName)}
      >
        <P5Canvas
          sketch={sedimentaryGrooveSketch}
          width={width}
          height={height}
          onLoadingChange={setIsLoading}
          fragShader={fragShader}
          vertShader={vertShader}
        />
      </motion.div>

      <AnimatePresence mode="wait" propagate>
        {isLoading && (
          <motion.div
            layout
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <IconLoader2 className="size-4 animate-spin stroke-dark-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default SedimentaryGrooveP5;
