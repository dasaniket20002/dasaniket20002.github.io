import {
  BakeShadows,
  Edges,
  Float,
  MeshPortalMaterial,
  MeshTransmissionMaterial,
  TrackballControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  ChromaticAberration,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import type { MeshStandardMaterial } from "three";
import { usePerformanceMetrics } from "../../../contexts/use-performance-metrics";
import { useQualitySettings } from "../../../hooks/use-quality-settings";
import { COLOR_DARK_D, COLOR_DARK_L, COLOR_LIGHT_L } from "../../../utils";

export default function PortalBox({
  eventSource,
  className,
  inView,
  theme = "light",
}: {
  eventSource?: React.RefObject<HTMLElement | null>;
  className?: string;
  inView?: boolean;
  theme?: "light" | "dark";
}) {
  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);
  return (
    <Canvas
      shadows
      camera={{ position: [8, 8, 8], near: 1, far: 50, fov: 24 }}
      className={className}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix={eventSource ? "client" : "offset"}
      gl={{
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
      }}
      frameloop={inView === false ? "never" : "always"}
    >
      <TrackballControls noZoom />
      <BakeShadows />
      <Float speed={2} rotationIntensity={2.5} scale={1.5}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <Edges color={theme === "light" ? COLOR_LIGHT_L : COLOR_DARK_D} />

          <Side rotation={[0, 0, 0]} theme={theme} index={0}>
            <octahedronGeometry />
          </Side>
          <Side rotation={[0, Math.PI, 0]} theme={theme} index={1}>
            <icosahedronGeometry />
          </Side>
          <Side
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            theme={theme}
            index={2}
          >
            <torusGeometry args={[0.75, 0.3, 32]} />
          </Side>
          <Side
            rotation={[0, Math.PI / 2, -Math.PI / 2]}
            theme={theme}
            index={3}
          >
            <boxGeometry args={[1.25, 1.25, 1.25]} />
          </Side>
          <Side rotation={[0, -Math.PI / 2, 0]} theme={theme} index={4}>
            <torusKnotGeometry args={[0.55, 0.3, 128, 32]} />
          </Side>
          <Side rotation={[0, Math.PI / 2, 0]} theme={theme} index={5}>
            <dodecahedronGeometry />
          </Side>
        </mesh>
      </Float>

      <EffectComposer
        multisampling={0}
        enabled={qualitySettings.usePostProcessing}
      >
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0025, 0.0005]}
          resolutionX={qualitySettings.effectRes}
          resolutionY={qualitySettings.effectRes}
        />
      </EffectComposer>
    </Canvas>
  );
}

function Side({
  rotation = [0, 0, 0],
  children,
  index,
  theme,
}: {
  rotation?: [number, number, number];
  children?: React.ReactNode;
  index: number;
  theme: "light" | "dark";
}) {
  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);
  const { meshes } = useGLTF("/assets/models/aobox/aobox-transformed.glb");

  return (
    <MeshPortalMaterial
      attach={`material-${index}`}
      transparent
      resolution={512}
      blur={3}
    >
      {/** Everything in here is inside the portal and isolated from the canvas */}
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[-10, 20, -10]}
        intensity={2}
        shadow-mapSize={512}
      />
      <directionalLight
        position={[10, -20, 10]}
        intensity={1}
        shadow-mapSize={512}
      />

      {/** A box with baked AO */}
      <mesh
        castShadow
        receiveShadow
        rotation={rotation}
        geometry={meshes.Cube.geometry}
      >
        <meshStandardMaterial
          color={theme === "light" ? COLOR_LIGHT_L : COLOR_DARK_D}
          aoMapIntensity={1}
          aoMap={(meshes.Cube.material as MeshStandardMaterial).aoMap}
        />
      </mesh>

      {/** The shape */}
      <Float speed={1} rotationIntensity={20}>
        <mesh castShadow receiveShadow>
          {children}
          <MeshTransmissionMaterial
            anisotropy={0.1}
            attenuationDistance={0.5}
            chromaticAberration={0.06}
            clearcoat={1}
            color={theme === "light" ? COLOR_DARK_L : COLOR_LIGHT_L}
            ior={1.33}
            resolution={qualitySettings.glassRes}
            roughness={0}
            samples={qualitySettings.glassSamples}
            thickness={1}
            transmission={1}
          />
        </mesh>
      </Float>
    </MeshPortalMaterial>
  );
}
