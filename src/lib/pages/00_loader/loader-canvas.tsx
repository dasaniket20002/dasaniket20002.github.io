import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  FXAA,
  SSAO,
} from "@react-three/postprocessing";
import { useRef } from "react";
import { Color, type Group } from "three";
import {
  useBenchmarkRunner,
  usePerformanceMetrics,
} from "../../contexts/use-performance-metrics";
import { converter } from "culori";
import { getColorPropertyValue } from "../../utils";

const COLS = 22;
const STRESS_COUNT = COLS * COLS;
const SPACING = 1;

const _COLOR_DARK = converter("rgb")(getColorPropertyValue("dark-d"));
const COLOR_DARK = new Color().setRGB(
  _COLOR_DARK?.r ?? 0,
  _COLOR_DARK?.g ?? 0,
  _COLOR_DARK?.b ?? 0,
);

export default function LoaderCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { findStaticMetrics } = usePerformanceMetrics();

  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 0, 5], fov: 24, near: 1, far: 100 }}
      gl={{
        alpha: true,
        antialias: false,
        stencil: false,
        depth: false,
      }}
      onCreated={(state) => {
        state.gl.toneMappingExposure = 1.5;
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
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    group.current?.rotateY((Math.PI / 8) * delta * 0.5);
  });
  useBenchmarkRunner();

  return (
    <>
      <group ref={group}>
        <mesh
          position={[0, 0, 0]}
          rotation={[
            Math.atan(Math.SQRT1_2),
            Math.PI / 4,
            Math.atan(Math.SQRT1_2),
          ]}
        >
          <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
          <meshPhysicalMaterial
            reflectivity={0.9}
            roughness={0.1}
            metalness={0.1}
            iridescence={0.7}
            iridescenceIOR={1.3}
            wireframe
          />
        </mesh>
      </group>
      {Array.from({ length: STRESS_COUNT }, (_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);

        const x = (col - (COLS - 1) / 2) * SPACING;
        const y = (row - (COLS - 1) / 2) * SPACING;

        return (
          <mesh key={i} position={[x, y, -50]}>
            <boxGeometry args={[1, 1, 1, 8, 8, 8]} />
            <meshPhysicalMaterial
              color={COLOR_DARK}
              transparent
              opacity={0.5}
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
      <EffectComposer multisampling={0} enableNormalPass>
        <FXAA />
        <SSAO samples={8} radius={1} intensity={1} luminanceInfluence={0.2} />
        <DepthOfField
          focusDistance={5}
          focalLength={4}
          bokehScale={4}
          height={720}
        />
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.5} height={360} />
      </EffectComposer>
    </>
  );
}
