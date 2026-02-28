import {
  Center,
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  Text,
  useCursor,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ChromaticAberration,
  EffectComposer,
  TiltShift2,
  ToneMapping,
} from "@react-three/postprocessing";
import { useLenis } from "lenis/react";
import { backInOut, MotionValue, useScroll, useTransform } from "motion/react";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { useCallback, useRef, useState } from "react";
import { Group } from "three";
import { useStickySnap } from "../../contexts/use-sticky-snap";
import { getColorPropertyRGB } from "../../utils";
import CameraRig from "../r3f-common/camera-rig";

const COLOR_DARK = getColorPropertyRGB("dark-d");
const COLOR_LIGHT = getColorPropertyRGB("light-l");

export default function GlassScene({
  eventSource,
  className,
  inView,
}: {
  eventSource?: React.RefObject<HTMLElement | null>;
  className?: string;
  inView?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: canvasRef,
    offset: ["start center", "start start"],
  });
  const yLoc = useTransform(scrollYProgress, [0, 1], [-2, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  return (
    <Canvas
      ref={canvasRef}
      shadows
      camera={{ position: [0, 0, 20], fov: 24, near: 1, far: 100 }}
      className={className}
      eventSource={eventSource as React.RefObject<HTMLElement>}
      eventPrefix={eventSource ? "client" : "offset"}
      gl={{
        alpha: false,
        antialias: false,
        depth: true,
        stencil: true,
      }}
      frameloop={inView === false ? "never" : "always"}
    >
      <Scene yLoc={yLoc} scale={scale} />
      <CameraRig enabled={true} z={20} />
    </Canvas>
  );
}

function Scene({
  yLoc,
  scale,
}: {
  yLoc: MotionValue<number>;
  scale: MotionValue<number>;
}) {
  const knotRef = useRef<Group>(null);
  const textRef = useRef<Group>(null);

  useFrame(() => {
    if (!textRef.current) return;
    textRef.current.position.y = yLoc.get() + 0.5;

    if (!knotRef.current) return;
    knotRef.current.position.y = yLoc.get() - 0.5;
    knotRef.current.scale.set(scale.get(), scale.get(), scale.get());
  });

  return (
    <>
      <color attach="background" args={[COLOR_LIGHT]} />

      <Center ref={textRef} position={[1, -1, -10]}>
        <Text
          fontSize={8}
          letterSpacing={-0.025}
          fontWeight={800}
          color={COLOR_DARK}
          scale={[1.75, 1, 1]}
        >
          / A - D /
        </Text>
      </Center>

      <Center ref={knotRef} position={[1, -2, -10]}>
        <Knot />
      </Center>

      <Environment preset="city">
        <Lightformer
          intensity={8}
          position={[10, 5, 0]}
          scale={[10, 50, 1]}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        />
      </Environment>

      <EffectComposer multisampling={4}>
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <TiltShift2 blur={0.15} taper={0.75} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.001, 0.0001]}
        />
      </EffectComposer>
    </>
  );
}

function Knot() {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const lenis = useLenis();
  const { lockSnap, unlockSnap } = useStickySnap();

  const handleClick = useCallback(() => {
    lockSnap();
    lenis?.scrollTo("#footer", {
      onComplete: unlockSnap,
      lock: true,
      duration: 1,
      easing: backInOut,
    });
  }, [lenis, lockSnap, unlockSnap]);

  return (
    <Float speed={1} rotationIntensity={5}>
      <mesh
        receiveShadow
        castShadow
        position={[0, -0.5, 0]}
        scale={0.75}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        <torusKnotGeometry args={[3, 1, 256, 64]} />
        <MeshTransmissionMaterial
          anisotropy={0.1}
          attenuationColor="#ffffff"
          attenuationDistance={0.5}
          chromaticAberration={0.06}
          clearcoat={1}
          color={"white"}
          distortion={0}
          distortionScale={0.3}
          ior={1.5}
          resolution={2048}
          roughness={0}
          samples={10}
          temporalDistortion={0.5}
          thickness={3.5}
          transmission={1}
        />
      </mesh>
    </Float>
  );
}
