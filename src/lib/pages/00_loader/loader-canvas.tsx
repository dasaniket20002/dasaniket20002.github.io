import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  FXAA,
  SSAO,
} from "@react-three/postprocessing";
import { useEffect, useRef } from "react";
import { type Group } from "three";
import {
  useBenchmarkRunner,
  usePerformanceMetrics,
} from "../../contexts/use-performance-metrics";

const STRESS_COUNT = 500;

export default function LoaderCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { findStaticMetrics, benchmarkMetrics } = usePerformanceMetrics();

  useEffect(() => {
    if (benchmarkMetrics) console.log(benchmarkMetrics);
  }, [benchmarkMetrics]);
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
          rotation={[Math.atan(Math.SQRT1_2), Math.PI / 4, 0]}
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
      {Array.from({ length: STRESS_COUNT }, (_, i) => i).map((i) => {
        const COLS = Math.round(Math.sqrt(STRESS_COUNT));
        const SPACING = 1.2;

        const col = i % COLS;
        const row = Math.floor(i / COLS);

        const x = (col - (COLS - 1) / 2) * SPACING;
        const z = (row + 5) * SPACING;
        return (
          <mesh key={i} position={[x, 0, z]}>
            <boxGeometry args={[1, 1, 1, 4, 4, 4]} />
            <meshPhysicalMaterial
              transparent
              opacity={0.5}
              roughness={0.2}
              reflectivity={0.28}
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
