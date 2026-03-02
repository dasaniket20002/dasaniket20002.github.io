import {
  Float,
  MeshTransmissionMaterial,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  SSAO,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useRef } from "react";
import {
  useBenchmarkRunner,
  usePerformanceMetrics,
} from "../../contexts/use-performance-metrics";
import { COLOR_LIGHT_L } from "../../utils";

const COLS = 22;
const STRESS_COUNT = COLS * COLS;
const SPACING = 1;

export default function LoaderCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { findStaticMetrics } = usePerformanceMetrics();

  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 0, 5], fov: 24, near: 1, far: 500 }}
      gl={{
        alpha: true,
        antialias: false,
        stencil: false,
        depth: false,
      }}
      onCreated={(state) => {
        findStaticMetrics(state.gl.getContext());
      }}
      className={className}
    >
      <LightsAndEffects />
      <MeshComponents />
      <OrbitControls />
    </Canvas>
  );
}

function MeshComponents() {
  useBenchmarkRunner();

  return (
    <>
      <Float speed={1} rotationIntensity={5}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.75, 0.75, 0.75, 4, 4, 4]} />
          <meshPhysicalMaterial
            reflectivity={0.9}
            roughness={0.1}
            metalness={0.1}
            iridescence={0.7}
            iridescenceIOR={1.3}
          />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.25, 1.25, 1.25, 4, 4, 4]} />
          <MeshTransmissionMaterial
            anisotropy={0.1}
            attenuationColor="#ffffff"
            attenuationDistance={0.5}
            chromaticAberration={0.06}
            clearcoat={1}
            color={"white"}
            distortion={0}
            distortionScale={0.3}
            ior={1.33}
            resolution={512}
            roughness={0}
            samples={8}
            temporalDistortion={0.5}
            thickness={3.5}
            transmission={1}
          />
        </mesh>
      </Float>
      {Array.from({ length: STRESS_COUNT }, (_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);

        const x = (col - (COLS - 1) / 2) * SPACING;
        const y = (row - (COLS - 1) / 2) * SPACING;

        return (
          <mesh key={i} position={[x, y, -50]}>
            <boxGeometry args={[1, 1, 1, 8, 8, 8]} />
            <meshPhysicalMaterial
              color={COLOR_LIGHT_L}
              transparent
              opacity={0.8}
              roughness={0.2}
              reflectivity={0.2}
              metalness={0.2}
              iridescence={0.7}
              iridescenceIOR={1.3}
            />
          </mesh>
        );
      })}
    </>
  );
}

function LightsAndEffects() {
  return (
    <>
      <color
        attach="background"
        args={[COLOR_LIGHT_L.clone().multiplyScalar(2)]}
      />
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 7.5, 5]}
        intensity={1}
        color="white"
        castShadow
        shadow-mapSize={1024}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-10, 10, 10, -10, 1, 128]}
        />
      </directionalLight>
      <EffectComposer multisampling={8} enableNormalPass>
        <SSAO samples={8} radius={1} intensity={1} luminanceInfluence={0.2} />
        <DepthOfField
          focusDistance={5}
          focalLength={4}
          bokehScale={12}
          height={720}
        />
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.5} height={360} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
