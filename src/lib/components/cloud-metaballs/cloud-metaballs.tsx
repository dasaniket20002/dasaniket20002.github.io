import { Billboard } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { COLOR_LIGHT_D, COLOR_LIGHT_L } from "../../utils";
import CameraRig from "../r3f-common/camera-rig";
import { CubeScatter, DotField, RadialLines } from "../r3f-common/hud";
import { CloudInputHandler } from "./cloud-scene-logic";
import { CLOUD_BALLS, useCloudSimContext } from "./cloud-sim-context";
import CloudVisualsClient from "./cloud-visuals-client";

const SceneLights = () => (
  <>
    <ambientLight intensity={0.5} color={COLOR_LIGHT_D} />
    <directionalLight
      position={[3, 4, 2]}
      intensity={1.8}
      color={COLOR_LIGHT_L}
    />
    <directionalLight
      position={[-2, 1, -3]}
      intensity={0.6}
      color={COLOR_LIGHT_L}
    />
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
      camera={{ position: [0, 0, 4.5], fov: 50, near: 1, far: 1000 }}
      dpr={[1, 1.5]}
      className={className}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix={eventSource ? "client" : "offset"}
      gl={{
        alpha: true,
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
        baseColor={COLOR_LIGHT_L}
        inView={inView}
        position={[0, 0, 0]}
      />

      <Billboard position={[0, 0, -10]}>
        <DotField position={[10, -5, -20]} color={"gray"} opacity={0.2} />
        <DotField position={[-20, 10, -25]} color={"gray"} opacity={0.3} />
        <CubeScatter
          position={[0, 0, -40]}
          scale={1.5}
          color={"lightgray"}
          opacity={0.25}
        />
        <RadialLines
          rotation={[0, 0, Math.PI / 12]}
          color={"lightgray"}
          opacity={0.15}
        />
      </Billboard>

      <CameraRig z={4.5} />
    </Canvas>
  );
}
