import { P5Canvas } from "@p5-wrapper/react";
import { IconLoader2 } from "@tabler/icons-react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import fragShader from "../components/shaders/sedimentary-groove-fs.glsl?raw";
import vertShader from "../components/shaders/sedimentary-groove-vs.glsl?raw";
import { useElementSize } from "../hooks/use-element-size";
import { cn } from "../utils";
import { sedimentaryGrooveSketch } from "./sketches/sedimentary-groove-sketch";

const SedimentaryGrooveP5 = forwardRef<
  HTMLDivElement,
  { className?: string } & HTMLMotionProps<"div">
>(({ className, ...motionProps }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(containerRef);
  const [isLoading, setIsLoading] = useState(true);

  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);
  return (
    <motion.div
      ref={containerRef}
      className={cn("relative size-full", className)}
      {...motionProps}
    >
      <P5Canvas
        sketch={sedimentaryGrooveSketch}
        width={width}
        height={height}
        onLoadingChange={setIsLoading}
        fragShader={fragShader}
        vertShader={vertShader}
      />
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center border-dark-1 border border-dashed"
          >
            <IconLoader2 className="size-4 animate-spin stroke-dark-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default SedimentaryGrooveP5;
