import { useFrame, useThree } from "@react-three/fiber";
import type { BodyRegistry } from "./body-registry";
import type { CloudBallsData } from "./cloud-metaballs";
import {
  BallCollider,
  RigidBody,
  type RapierCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import { Plane, Raycaster, Vector2, Vector3 } from "three";

const MOUSE_SPHERE_RADIUS = 0.6;
const MOUSE_PUSH_RADIUS = 1.2;
const MOUSE_PUSH_FORCE = 18.0;

interface MousePusherProps {
  registryRef: React.RefObject<BodyRegistry>;
  ballConfigs: CloudBallsData[];
}

export default function MousePusher({
  registryRef,
  ballConfigs,
}: MousePusherProps) {
  const { camera } = useThree();
  const mouseRbRef = useRef<RapierRigidBody>(null);
  const colliderRef = useRef<RapierCollider>(null); // New ref for the collider

  // Data refs
  const rcRef = useRef(new Raycaster());
  const planeRef = useRef(new Plane(new Vector3(0, 0, 1), 0));
  const hitPtRef = useRef(new Vector3());
  const smoothPtRef = useRef(new Vector3(0, 0, 100));
  const pNrmRef = useRef(new Vector3());
  const originRef = useRef(new Vector3());
  const pointerVecRef = useRef(new Vector2());

  // State refs
  const prevPointerRef = useRef(new Vector2(0, 0));
  const activeRef = useRef(true); // Track active state to minimize API calls

  useFrame(({ pointer }) => {
    const mouseBody = mouseRbRef.current;
    if (!mouseBody) return;

    // 1. Detect movement
    const dx = pointer.x - prevPointerRef.current.x;
    const dy = pointer.y - prevPointerRef.current.y;
    // Threshold squared (0.0001 is sensitive enough)
    const isMoving = dx * dx + dy * dy > 0.0001;

    // 2. Toggle Collider physics based on movement
    if (colliderRef.current) {
      if (isMoving && !activeRef.current) {
        // Activate: Collide with everything (Default mask)
        colliderRef.current.setCollisionGroups(0xffffffff);
        activeRef.current = true;
      } else if (!isMoving && activeRef.current) {
        // Deactivate: Collide with nothing
        colliderRef.current.setCollisionGroups(0x00000000);
        activeRef.current = false;
      }
    }

    prevPointerRef.current.set(pointer.x, pointer.y);

    // 3. Update Position (Standard raycast logic)
    pointerVecRef.current.set(pointer.x, pointer.y);
    camera.getWorldDirection(pNrmRef.current);
    planeRef.current.setFromNormalAndCoplanarPoint(
      pNrmRef.current,
      originRef.current,
    );
    rcRef.current.setFromCamera(pointerVecRef.current, camera);

    if (rcRef.current.ray.intersectPlane(planeRef.current, hitPtRef.current)) {
      smoothPtRef.current.lerp(hitPtRef.current, 0.12);
    }

    mouseBody.setTranslation(
      {
        x: smoothPtRef.current.x,
        y: smoothPtRef.current.y,
        z: smoothPtRef.current.z,
      },
      true,
    );

    // 4. Apply Manual Impulses (Only when moving)
    if (isMoving && registryRef.current) {
      for (let i = 0; i < ballConfigs.length; i++) {
        const body = registryRef.current.get(i);
        if (!body) continue;

        const pos = body.translation();
        const dx = pos.x - smoothPtRef.current.x;
        const dy = pos.y - smoothPtRef.current.y;
        const dz = pos.z - smoothPtRef.current.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Slightly larger radius for the 'wind' effect than the physical collider
        if (dist < MOUSE_PUSH_RADIUS && dist > 0.01) {
          const strength =
            (1.0 - dist / MOUSE_PUSH_RADIUS) * MOUSE_PUSH_FORCE * 0.016;
          const invDist = 1.0 / dist;
          body.applyImpulse(
            {
              x: dx * invDist * strength,
              y: dy * invDist * strength,
              z: dz * invDist * strength,
            },
            true,
          );
        }
      }
    }
  });

  return (
    <RigidBody
      ref={mouseRbRef}
      type="kinematicPosition"
      position={[0, 0, 100]}
      colliders={false} // We manually add the collider to get the ref
    >
      <BallCollider ref={colliderRef} args={[MOUSE_SPHERE_RADIUS]} />
    </RigidBody>
  );
}
