import { Canvas } from "@react-three/fiber";
import { memo, Suspense, useRef, type RefObject } from "react";
import CameraControls from "./camera-controls";
import LightsAndEffects from "./lights_effects";
import MeshComponents from "./mesh-components";
import { usePerformanceMetrics } from "../../contexts/use-performance-metrics";
import { useQualitySettings } from "../../hooks/use-quality-settings";

const MeshComponentsMemo = memo(() => (
  <Suspense fallback={null}>
    <MeshComponents />
  </Suspense>
));

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
  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);

  return (
    <Canvas
      ref={canvasRef}
      shadows
      dpr={[1, 2]}
      camera={{ position: [-32, 32, 32], fov: 24 }}
      gl={{
        alpha: true,
        antialias: false,
        stencil: !qualitySettings?.usePostProcessing,
        depth: !qualitySettings?.usePostProcessing,
        powerPreference: "high-performance",
      }}
      onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
      className={className}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix={eventSource ? "client" : "offset"}
      frameloop={inView ? "always" : "never"}
    >
      <MeshComponentsMemo />
      <LightsAndEffects />
      {qualitySettings.useCameraControls && (
        <CameraControls eventTarget={eventSource ?? canvasRef} />
      )}
    </Canvas>
  );
}
