import { useEffect, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Physics,
  RigidBody,
  BallCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { useCloudSimContext, type CloudBallsData } from "./cloud-sim-context";
import { Plane, Raycaster, Vector2, Vector3 } from "three";
import { usePerformanceMetrics } from "../../contexts/use-performance-metrics";
import { useQualitySettings } from "../../hooks/use-quality-settings";

const SPRING_STIFFNESS = 8.0;
const SPRING_DAMPING = 3.0;
const MOUSE_SPHERE_RADIUS = 0.6;
const MOUSE_PUSH_RADIUS = 1.2;
const MOUSE_PUSH_FORCE = 18.0;

export function CloudPhysicsHost({ balls }: { balls: CloudBallsData[] }) {
  const { registryRef, mouseTargetRef, mouseActiveRef } = useCloudSimContext();
  const mouseRbRef = useRef<RapierRigidBody>(null);

  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);

  useFrame(() => {
    if (!mouseRbRef.current) return;

    const { x, y, z } = mouseTargetRef.current;
    mouseRbRef.current.setTranslation({ x, y, z }, true);

    if (mouseActiveRef.current) {
      for (let i = 0; i < balls.length; i++) {
        const body = registryRef.current.get(i);
        if (!body) continue;

        const pos = body.translation();
        const dx = pos.x - x;
        const dy = pos.y - y;
        const dz = pos.z - z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

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
    <Physics gravity={[0, 0, 0]} timeStep={1 / 60}>
      {balls.map((ball, i) => (
        <PhysicsBall key={i} index={i} config={ball} />
      ))}

      {qualitySettings.colliderPhysicsEnabled && (
        <RigidBody
          ref={mouseRbRef}
          type="kinematicPosition"
          position={[0, 0, 100]}
          colliders={false}
        >
          <BallCollider args={[MOUSE_SPHERE_RADIUS]} />
        </RigidBody>
      )}
    </Physics>
  );
}

function PhysicsBall({
  index,
  config,
}: {
  index: number;
  config: CloudBallsData;
}) {
  const { registryRef } = useCloudSimContext();
  const rbRef = useRef<RapierRigidBody>(null);
  const restPos = useMemo(
    () => new Vector3(config.x, config.y, config.z),
    [config],
  );

  useEffect(() => {
    const registry = registryRef.current;
    registry.set(index, rbRef.current);
    return () => registry.set(index, null);
  }, [index, registryRef]);

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
        restPos.x + 20 + 0.25 * index * index * 2,
        restPos.y - 20 + 0.05 * index * index,
        restPos.z - 10 + 0.5 * index * index * 2,
      ]}
      gravityScale={0}
      linearDamping={1.5}
      angularDamping={10}
      enabledRotations={[false, false, false]}
    >
      <BallCollider args={[config.r * 0.9]} />
    </RigidBody>
  );
}

export function CloudInputHandler() {
  const { mouseTargetRef, mouseActiveRef } = useCloudSimContext();
  const { camera, pointer } = useThree();

  const rcRef = useRef(new Raycaster());
  const planeRef = useRef(new Plane(new Vector3(0, 0, 1), 0));
  const hitPtRef = useRef(new Vector3());
  const prevPointer = useRef(new Vector2(0, 0));

  const { performanceRating } = usePerformanceMetrics();
  const qualitySettings = useQualitySettings(performanceRating);

  useFrame(() => {
    if (!qualitySettings.colliderPhysicsEnabled) return;

    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;
    const isMoving = dx * dx + dy * dy > 0.00001;

    if (isMoving) {
      mouseActiveRef.current = true;
      prevPointer.current.copy(pointer);
    }

    rcRef.current.setFromCamera(pointer, camera);

    const pNrm = new Vector3();
    camera.getWorldDirection(pNrm);
    planeRef.current.setFromNormalAndCoplanarPoint(pNrm, new Vector3(0, 0, 0));

    if (
      rcRef.current.ray.intersectPlane(planeRef.current, hitPtRef.current) &&
      isMoving
    ) {
      mouseTargetRef.current.lerp(hitPtRef.current, 0.12);
    }
  });

  return null;
}
