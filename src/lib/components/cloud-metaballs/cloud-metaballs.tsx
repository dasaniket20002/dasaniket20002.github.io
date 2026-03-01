import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import CameraRig from "../r3f-common/camera-rig";
import { CloudInputHandler } from "./cloud-scene-logic";
import { CLOUD_BALLS, useCloudSimContext } from "./cloud-sim-context";
import CloudVisualsClient from "./cloud-visuals-client";

const SceneLights = () => (
  <>
    <color attach="background" args={["#f0f0f0"]} />
    <ambientLight intensity={0.4} color="#e8e0f0" />
    <directionalLight position={[3, 4, 2]} intensity={1.8} color="#ffffff" />
    <directionalLight position={[-2, 1, -3]} intensity={0.6} color="#8090ff" />
  </>
);

export default function CloudMetaballs({
  eventSource,
  className,
  inView = true,
}: {
  eventSource?: React.RefObject<HTMLElement | null>;
  className?: string;
  inView?: boolean;
}) {
  const { registerView } = useCloudSimContext();

  useEffect(() => {
    if (inView) {
      registerView(true);
      return () => registerView(false);
    }
  }, [inView, registerView]);

  return (
    <Canvas
      camera={{ position: [0, 0.3, 4.5], fov: 50 }}
      dpr={[1, 1.5]}
      className={className}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix={eventSource ? "client" : "offset"}
      gl={{
        alpha: false,
        antialias: true,
        stencil: false,
        depth: true,
        powerPreference: "high-performance",
      }}
      frameloop={inView ? "always" : "never"}
    >
      <SceneLights />

      <CloudInputHandler />

      <CloudVisualsClient
        ballConfigs={CLOUD_BALLS}
        smoothness={0.5}
        baseColor="white"
        inView={inView}
      />
      <CameraRig z={4.5} />
    </Canvas>
  );
}
