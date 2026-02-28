import { BakeShadows, MeshReflectorMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";
import { easing } from "maath";
import { ReinhardToneMapping, SRGBColorSpace } from "three";
import { Computers, Instances } from "./computers";
import { getColorPropertyRGB } from "../../utils";

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
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [-1.5, 1, 5.5], fov: 45, near: 1, far: 20 }}
      className={className}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix={eventSource ? "client" : "offset"}
      gl={{
        alpha: true,
        antialias: true,
        stencil: false,
        depth: false,
        powerPreference: "high-performance",
        toneMapping: ReinhardToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      frameloop={inView ? "always" : "never"}
    >
      {/* Lights */}
      {/* <color attach="background" args={[COLOR_DARK]} /> */}
      <hemisphereLight intensity={0.015} groundColor={COLOR_DARK} />
      <spotLight
        position={[10, 20, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />

      {/* Main scene */}
      <group position={[-0, -1, 0]}>
        {/* Auto-instanced sketchfab model */}
        <Instances>
          <Computers scale={0.5} />
        </Instances>
        {/* Plane reflections + distance blur */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 30]}
            resolution={2048}
            mixBlur={1}
            mixStrength={180}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color={COLOR_DARK}
            metalness={0.8}
          />
        </mesh>
        {/* a light give it more realism */}
        <pointLight
          distance={1.5}
          intensity={10}
          position={[-0.15, 0.7, 0]}
          color={COLOR_DARK}
        />
        <pointLight
          distance={1}
          intensity={2}
          position={[-0.15, 0.7, 0]}
          color={COLOR_LIGHT}
        />
      </group>
      {/* Postprocessing */}
      <EffectComposer>
        <DepthOfField
          target={[0, 0, -1]}
          focalLength={2}
          bokehScale={8}
          height={700}
        />
        <Bloom
          luminanceThreshold={0.4}
          mipmapBlur
          luminanceSmoothing={0.15}
          intensity={5}
        />
      </EffectComposer>
      {/* Camera movements */}
      <CameraRig />
      {/* Small helper that freezes the shadows for better performance */}
      <BakeShadows />
    </Canvas>
  );
}

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        -1 + (state.pointer.x * state.viewport.width) / 10,
        (1 + state.pointer.y) / 2,
        5.5,
      ],
      0.5,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}
