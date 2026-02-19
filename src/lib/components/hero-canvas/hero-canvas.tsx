import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, type RefObject } from "react";
import CameraControls from "./camera-controls";
import LightsAndEffects from "./lights_effects";
import MeshComponents from "./mesh-components";

export default function HeroCanvas({
  eventSource,
  className,
  inView = true,
}: {
  eventSource?: RefObject<HTMLElement | null>;
  className?: string;
  inView?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <Canvas
      ref={canvasRef}
      shadows
      dpr={[1, 2]}
      camera={{ position: [-32, 32, 32], fov: 24 }}
      gl={{
        alpha: true,
        antialias: true,
        stencil: false,
        depth: false,
        powerPreference: "high-performance",
      }}
      onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
      className={className}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix={eventSource ? "client" : "offset"}
      frameloop={inView ? "always" : "never"}
    >
      <Suspense fallback={null}>
        <MeshComponents />
      </Suspense>
      <LightsAndEffects />
      <CameraControls canvasRef={canvasRef} />
    </Canvas>
  );
}
