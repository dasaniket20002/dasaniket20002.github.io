import { Environment, useGLTF } from "@react-three/drei";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeElement,
  type ThreeEvent,
} from "@react-three/fiber";
import { EffectComposer, SSAO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { formatHex } from "culori";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Suspense, useCallback, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { getColorPropertyValue } from "../../utils";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const DisableRender = () => useFrame(() => null, 1000);

const DEBUG = false;
const GRAVITY: THREE.Vector3Tuple = [0, 4, 0];

const BALLOON_COLOR = formatHex(getColorPropertyValue("light-2"));

const BALLOON_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: BALLOON_COLOR,
  transparent: true,
  opacity: 0.5,
  roughness: 0.14,
  metalness: 0.74,
  reflectivity: 0.83,
  iridescence: 0.9,
  iridescenceIOR: 1.82,
  clearcoat: 0.5,
  clearcoatRoughness: 0.12,
  side: THREE.DoubleSide,
});

export default function FloatingBalloon({
  eventSource,
  className,
  inView,
}: {
  eventSource?: RefObject<HTMLElement | null>;
  className?: string;
  inView?: boolean;
}) {
  return (
    <Canvas
      shadows
      gl={{
        alpha: true,
        stencil: false,
        depth: false,
        antialias: true,
        // powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 10], fov: 24, near: 1, far: 100 }}
      onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
      className={className}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix={eventSource ? "client" : "offset"}
      frameloop="demand"
    >
      {!inView && <DisableRender />}
      <Suspense fallback={null}>
        <Physics paused={!inView} debug={DEBUG} gravity={GRAVITY}>
          {inView && <FloatingBalloonComponent />}
        </Physics>
      </Suspense>

      {inView && <FloatingBalloonLightsAndEffects />}
    </Canvas>
  );
}

function FloatingBalloonLightsAndEffects() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 5, -4]} intensity={4} />
      <directionalLight position={[0, -15, -0]} intensity={1} color={"beige"} />
      <spotLight
        position={[20, 5, 10]}
        rotation={[0, 0, 0]}
        intensity={50}
        penumbra={1}
        color="white"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <Environment preset="studio" environmentRotation={[0, Math.PI / 2, 0]} />
      <EffectComposer multisampling={0} enableNormalPass>
        <SSAO
          samples={11}
          radius={0.15}
          intensity={20}
          luminanceInfluence={0.6}
          color={new THREE.Color(1, 1, 1)}
        />
        <SSAO
          samples={21}
          radius={0.03}
          intensity={15}
          luminanceInfluence={0.6}
          color={new THREE.Color(1, 1, 1)}
        />
      </EffectComposer>
    </>
  );
}

function FloatingBalloonComponent() {
  const { meshes } = useGLTF("/assets/models/round-foil-balloon-portrait.gltf");
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const balloon = useRef<RapierRigidBody>(null);
  const rope = useRef<THREE.Mesh>(null);

  // Ref to avoid re-renders
  const targetYRotation = useRef(0);

  useRopeJoint(
    fixed as RefObject<RapierRigidBody>,
    j1 as RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 0.35],
  );
  useRopeJoint(
    j1 as RefObject<RapierRigidBody>,
    j2 as RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 0.35],
  );
  useRopeJoint(
    j2 as RefObject<RapierRigidBody>,
    j3 as RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, 0, 0], 0.35],
  );
  useSphericalJoint(
    j3 as RefObject<RapierRigidBody>,
    balloon as RefObject<RapierRigidBody>,
    [
      [0, 0, 0],
      [0, 0, 0],
    ],
  );

  const { width, height } = useThree((state) => state.size);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
    [],
  );

  // Handle click - subtle oscillation on x and z axes
  const handleClick = useCallback(() => {
    if (!balloon.current) return;

    // Apply small impulse for subtle positional oscillation on x and z
    const impulseX = (Math.random() - 0.5) * 2;
    const impulseZ = (Math.random() - 0.5) * 2;
    balloon.current.applyImpulse({ x: impulseX, y: 0.02, z: impulseZ }, true);

    // Apply torque impulse for rotational oscillation on x and z axes
    balloon.current.applyTorqueImpulse(
      {
        x: (Math.random() - 0.5) * 2,
        y: 0,
        z: (Math.random() - 0.5) * 2,
      },
      true,
    );
  }, []);

  // Track hover position for Y-axis tilt (5 degrees)
  const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!balloon.current) return;

    const balloonPos = balloon.current.translation();
    const localX = event.point.x - balloonPos.x;

    // 5 degrees in radians
    const tiltAngle = (5 * Math.PI) / 180;

    // Tilt left when hovering on left, right when hovering on right
    targetYRotation.current = localX < 0 ? tiltAngle : -tiltAngle;
  }, []);

  const handlePointerLeave = () => {
    targetYRotation.current = 0;
  };

  useFrame(() => {
    if (
      fixed.current &&
      j1.current &&
      j2.current &&
      j3.current &&
      balloon.current &&
      rope.current
    ) {
      // Update rope curve
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.translation());
      curve.points[2].copy(j1.current.translation());
      curve.points[3].copy(fixed.current.translation());

      const geom = rope.current.geometry as MeshLineGeometry;
      geom.setPoints(curve.getPoints(32));

      // Get current rotation
      const rot = balloon.current.rotation();

      // Apply spring-like torque on Y axis to reach target rotation
      // This creates physics-based tilt that reacts to other forces
      const yRotationDiff = targetYRotation.current - rot.y;
      balloon.current.applyTorqueImpulse(
        { x: 0, y: yRotationDiff * 0.25, z: 0 },
        true,
      );
    }
  });

  return (
    <>
      <group position={[0, -2, 0]}>
        <RigidBody
          position={[0, -0.25, 0]}
          ref={fixed}
          angularDamping={2}
          linearDamping={2}
          type="fixed"
        >
          <BallCollider args={[0.05]} />
        </RigidBody>

        <RigidBody
          ref={j1}
          position={[0, 0, -0.25]}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={[0.05]} />
        </RigidBody>

        <RigidBody
          ref={j2}
          position={[0, 0, -0.5]}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={[0.05]} />
        </RigidBody>

        <RigidBody
          ref={j3}
          position={[0, 0, -0.75]}
          angularDamping={2}
          linearDamping={2}
          colliders={false}
        >
          <BallCollider args={[0.05]} />
          <mesh material={BALLOON_MATERIAL}>
            <sphereGeometry args={[0.05]} />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={balloon}
          position={[0, 0, 0]}
          angularDamping={3}
          linearDamping={2}
          type="dynamic"
          colliders="hull"
        >
          <mesh
            castShadow
            receiveShadow
            geometry={meshes["Balloon_o"].geometry}
            material={BALLOON_MATERIAL}
            onClick={handleClick}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={meshes["Portrait_o"].geometry}
            material={meshes["Portrait_o"].material}
          />
        </RigidBody>
      </group>

      <mesh ref={rope}>
        <meshLineGeometry />
        <meshLineMaterial
          transparent
          args={[
            {
              opacity: 0.75,
              color: "gray",
              lineWidth: 0.05,
              resolution: new THREE.Vector2(width, height),
            },
          ]}
        />
      </mesh>
    </>
  );
}
