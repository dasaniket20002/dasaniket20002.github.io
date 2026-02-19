import { Canvas } from "@react-three/fiber";
import { type MotionValue } from "motion";
import { memo, type RefObject } from "react";
import CameraControls from "./camera-controls";
import LightsAndEffects from "./lights_effects";
import MeshComponents from "./mesh-components";

const MemoLightsAndEffects = memo(() => <LightsAndEffects />);
const MemoComponents = memo(() => <MeshComponents />);

export default function HeroCanvas({
  eventSource,
  className,
  pointerX,
  pointerY,
}: {
  eventSource?: RefObject<HTMLElement | null>;
  className?: string;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  return (
    <Canvas
      shadows
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
    >
      <MemoLightsAndEffects />
      <MemoComponents />
      <CameraControls pointerX={pointerX} pointerY={pointerY} />
    </Canvas>
  );
}
