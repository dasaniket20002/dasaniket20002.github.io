import { Canvas } from "@react-three/fiber";
import {
  ChromaticAberration,
  EffectComposer,
  TiltShift2,
  ToneMapping,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { useEffect } from "react";
import { usePerformanceMetrics } from "../../contexts/use-performance-metrics";
import { useQualitySettings } from "../../hooks/use-quality-settings";
import { COLOR_LIGHT_D, COLOR_LIGHT_L } from "../../utils";
import CameraRig from "../r3f-common/camera-rig";
import { CubeScatter, DotField, RadialLines } from "../r3f-common/hud";
import { CloudInputHandler } from "./cloud-scene-logic";
import { CLOUD_BALLS, useCloudSimContext } from "./cloud-sim-context";
import CloudVisualsClient from "./cloud-visuals-client";

const SceneLights = () => (
  <>
    <color
      attach="background"
      args={[COLOR_LIGHT_L.clone().multiplyScalar(2)]}
    />
    <ambientLight intensity={1} color={COLOR_LIGHT_D} />
    <directionalLight
      position={[3, 4, 2]}
      intensity={3}
      color={COLOR_LIGHT_L}
    />
    <directionalLight
      position={[-2, 1, -3]}
      intensity={2}
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
  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);

  useEffect(() => {
    if (inView) {
      registerView(true);
      return () => registerView(false);
    }
  }, [inView, registerView]);

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 50, near: 1, far: 100 }}
      dpr={[1, 1.5]}
      shadows={false}
      className={className}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix={eventSource ? "client" : "offset"}
      gl={{
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      }}
      frameloop={inView ? "always" : "never"}
    >
      <SceneLights />

      {qualitySettings.colliderPhysicsEnabled && <CloudInputHandler />}

      <CloudVisualsClient
        ballConfigs={CLOUD_BALLS}
        smoothness={0.75}
        baseColor={COLOR_LIGHT_L}
        position={[0, 0, -50]}
      />

      <group position={[0, 0, -10]}>
        <DotField position={[-10, -1, -20]} color={"gray"} opacity={1} />
        <CubeScatter
          position={[0, -6, -10]}
          scale={1.5}
          color={"lightgray"}
          opacity={0.8}
        />
        <RadialLines
          rotation={[0, 0, Math.PI / 12]}
          position={[3, -1, 10]}
          color={"lightgray"}
          opacity={1}
        />
      </group>

      <CameraRig z={4.5} enabled={qualitySettings.useCameraControls} />

      <EffectComposer
        multisampling={0}
        enableNormalPass
        enabled={qualitySettings.usePostProcessing}
      >
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <TiltShift2
          blur={0.3}
          taper={0.75}
          resolutionX={qualitySettings.effectRes}
          resolutionY={qualitySettings.effectRes}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.00075, 0.00075]}
          resolutionX={qualitySettings.effectRes}
          resolutionY={qualitySettings.effectRes}
        />
      </EffectComposer>
    </Canvas>
  );
}
