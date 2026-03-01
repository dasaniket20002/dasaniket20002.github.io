import { Canvas } from "@react-three/fiber";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { useCallback, useRef } from "react";
import * as THREE from "three";
import CameraRig from "../r3f-common/camera-rig";
import { BodyRegistry } from "./body-registry";
import CloudBall from "./cloud-ball";
import CloudVisuals from "./cloud-visuals";
import MousePusher from "./mouse-sphere-collider";

export interface CloudBallsData {
  x: number;
  y: number;
  z: number;
  r: number;
}

const CLOUD_BALLS: CloudBallsData[] = [
  { x: 0, y: 0, z: 0, r: 0.55 },
  { x: 0.6, y: 0.05, z: 0, r: 0.5 },
  { x: -0.6, y: 0.05, z: 0, r: 0.48 },
  { x: 1.2, y: -0.05, z: 0, r: 0.42 },
  { x: -1.2, y: -0.05, z: 0, r: 0.4 },
  { x: -0.3, y: 0.45, z: 0, r: 0.44 },
  { x: 0.35, y: 0.5, z: 0, r: 0.48 },
  { x: -0.8, y: 0.3, z: 0, r: 0.38 },
  { x: 0.9, y: 0.3, z: 0, r: 0.36 },
  { x: 0.0, y: 0.7, z: 0, r: 0.35 },
  { x: 0.3, y: -0.25, z: 0.1, r: 0.38 },
  { x: -0.5, y: -0.22, z: -0.1, r: 0.36 },
];

export const MAX_BALLS = 32;
export const MAX_LIGHTS = 8;

interface CloudSceneProps {
  smoothness: number;
  baseColor: string;
}

function CloudScene({ smoothness, baseColor }: CloudSceneProps) {
  const registryRef = useRef(new BodyRegistry(CLOUD_BALLS.length));

  const registerBody = useCallback(
    (index: number, body: RapierRigidBody | null) => {
      registryRef.current.set(index, body);
    },
    [],
  );

  return (
    <>
      <CloudVisuals
        registryRef={registryRef}
        ballConfigs={CLOUD_BALLS}
        smoothness={smoothness}
        baseColor={baseColor}
      />
      <Physics gravity={[0, 0, 0]} timeStep={1 / 60}>
        {CLOUD_BALLS.map((ball, i) => (
          <CloudBall
            key={i}
            index={i}
            restPos={new THREE.Vector3(ball.x, ball.y, ball.z)}
            radius={ball.r}
            registerBody={registerBody}
          />
        ))}
        <MousePusher registryRef={registryRef} ballConfigs={CLOUD_BALLS} />
      </Physics>
    </>
  );
}

export default function CloudMetaballs() {
  return (
    <Canvas camera={{ position: [0, 0.3, 4.5], fov: 50 }} dpr={[1, 1.5]}>
      <color attach="background" args={["white"]} />

      <ambientLight intensity={0.4} color="#e8e0f0" />
      <directionalLight position={[3, 4, 2]} intensity={1.8} color="#ffffff" />
      <directionalLight
        position={[-2, 1, -3]}
        intensity={0.6}
        color="#8090ff"
      />

      <CloudScene smoothness={0.5} baseColor="#ffffff" />
      <CameraRig z={4.5} />
    </Canvas>
  );
}
