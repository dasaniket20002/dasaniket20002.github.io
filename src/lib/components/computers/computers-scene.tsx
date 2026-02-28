import { BakeShadows, MeshReflectorMaterial } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { usePerformanceMetrics } from "../../contexts/use-performance-metrics";
import { useQualitySettings } from "../../hooks/use-quality-settings";
import { getColorPropertyRGB } from "../../utils";
import CameraRig from "../r3f-common/camera-rig";
import { Computers, Instances } from "./computers";

const COLOR_DARK = getColorPropertyRGB("dark-d");
const COLOR_LIGHT = getColorPropertyRGB("light-l");

export default function ComputerScene({
  eventSource,
  className,
  inView,
}: {
  eventSource?: React.RefObject<HTMLElement | null>;
  className?: string;
  inView?: boolean;
}) {
  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{
        position: [-1.5, 1, 5.5],
        fov: 45,
        near: 1,
        far: 100,
      }}
      className={className}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix={eventSource ? "client" : "offset"}
      gl={{
        alpha: false,
        antialias: false,
        stencil: false,
        depth: true,
        powerPreference: "high-performance",
      }}
      frameloop={inView === false ? "never" : "always"}
    >
      {/* Auto-instanced sketchfab model */}
      <group position={[0, -1, 0]}>
        <Instances>
          <Computers scale={0.5} />
        </Instances>

        <ReflectorFloor />
      </group>

      <LightsEffects />

      <CameraRig enabled={qualitySettings.useCameraControls} z={5.5} />
      {/* <OrbitControls /> */}

      <BakeShadows />
    </Canvas>
  );
}

function ReflectorFloor({
  position,
}: {
  position?: [x: number, y: number, z: number];
}) {
  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);
  return (
    <mesh receiveShadow position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <MeshReflectorMaterial
        blur={[300, 30]}
        resolution={qualitySettings.reflectorRes}
        mixBlur={2}
        mixStrength={180}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.5}
        maxDepthThreshold={1.25}
        color={COLOR_DARK}
        metalness={0.8}
        mirror={0}
      />
    </mesh>
  );
}

function LightsEffects() {
  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);

  return (
    <>
      {/* Lights */}
      <color
        attach="background"
        args={[COLOR_DARK.clone().multiplyScalar(0.1)]}
      />
      <fog attach="fog" args={[COLOR_DARK]} />
      <hemisphereLight intensity={0.01} groundColor={COLOR_DARK} />
      <spotLight
        position={[10, 20, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={qualitySettings.shadowMapRes}
      />

      <group position={[0, -1, 0]}>
        {/* a light give it more realism */}
        <pointLight
          distance={1.5}
          intensity={10}
          position={[0.15, 1, -1]}
          color={COLOR_DARK}
        />
        <pointLight
          distance={2}
          intensity={1}
          position={[0.15, 0.5, 0]}
          color={COLOR_LIGHT}
        />
      </group>

      {/* Postprocessing */}
      <EffectComposer
        enabled={qualitySettings.usePostProcessing}
        multisampling={0}
      >
        <DepthOfField
          target={[0.15, 0.5, -1]}
          focalLength={1}
          bokehScale={6}
          resolutionX={qualitySettings.effectRes}
          resolutionY={qualitySettings.effectRes}
        />
        <Bloom
          luminanceThreshold={0.5}
          mipmapBlur
          luminanceSmoothing={0.25}
          intensity={4}
          resolutionX={qualitySettings.effectRes}
          resolutionY={qualitySettings.effectRes}
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
