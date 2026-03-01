import { useFrame } from "@react-three/fiber";
import {
  BallCollider,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useEffect, useRef } from "react";
import type { Vector3 } from "three";

const SPRING_STIFFNESS = 8.0;
const SPRING_DAMPING = 3.0;

interface CloudBallProps {
  index: number;
  restPos: Vector3;
  radius: number;
  registerBody: (index: number, body: RapierRigidBody | null) => void;
}

export default function CloudBall({
  index,
  restPos,
  radius,
  registerBody,
}: CloudBallProps) {
  const rbRef = useRef<RapierRigidBody>(null);

  useEffect(() => {
    registerBody(index, rbRef.current);
    return () => {
      registerBody(index, null);
    };
  }, [index, registerBody]);

  useFrame(() => {
    const body = rbRef.current;
    if (!body) return;

    const pos = body.translation();
    const vel = body.linvel();

    const dx = restPos.x - pos.x;
    const dy = restPos.y - pos.y;
    const dz = restPos.z - pos.z;

    const fx = dx * SPRING_STIFFNESS - vel.x * SPRING_DAMPING;
    const fy = dy * SPRING_STIFFNESS - vel.y * SPRING_DAMPING;
    const fz = dz * SPRING_STIFFNESS - vel.z * SPRING_DAMPING;

    body.applyImpulse({ x: fx * 0.01, y: fy * 0.01, z: fz * 0.01 }, true);
  });

  return (
    <RigidBody
      ref={rbRef}
      type="dynamic"
      position={[
        restPos.x + 20 + 0.25 * index * index,
        restPos.y - 20 + 0.05 * index * index,
        restPos.z - 10 + (0.5 * index * index) / 2,
      ]}
      gravityScale={0}
      linearDamping={1.5}
      angularDamping={10}
      enabledRotations={[false, false, false]}
    >
      <BallCollider args={[radius * 0.9]} />
    </RigidBody>
  );
}
