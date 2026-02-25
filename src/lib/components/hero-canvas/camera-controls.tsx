// camera-controls.tsx
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { Spherical, Vector2, Vector3 } from "three";
import { useElementSize } from "../../hooks/use-element-size";
import { EPSILON, mapRange } from "../../utils";

const SMOOTHING = 8;
const THETA_RANGE = Math.PI / 64;
const PHI_RANGE = Math.PI / 64;

export default function CameraControls({
  eventTarget,
}: {
  eventTarget: RefObject<HTMLElement | null>;
}) {
  const { camera } = useThree();
  const canvasSize = useElementSize(eventTarget);

  const pointer = useRef(new Vector2());
  const lerped = useRef(new Vector2());
  const previous = useRef(new Vector2());

  const baseSpherical = useRef<Spherical | null>(null);
  const _spherical = useRef(new Spherical());
  const _vec3 = useRef(new Vector3());

  useEffect(() => {
    const el = eventTarget.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.current.x = mapRange(
        (e.clientX - rect.left) / rect.width,
        0,
        1,
        -1,
        1,
      );
      pointer.current.y = mapRange(
        (e.clientY - rect.top) / rect.height,
        0,
        1,
        -1,
        1,
      );
    };

    const handleLeave = () => {
      // Reset to center so the camera smoothly returns to its base orientation
      pointer.current.set(0, 0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [eventTarget, canvasSize]);

  useFrame((state, delta) => {
    previous.current.copy(lerped.current);

    const t = 1 - Math.exp(-SMOOTHING * delta);
    lerped.current.lerp(pointer.current, t);

    if (previous.current.distanceTo(lerped.current) > EPSILON) {
      state.performance.regress();
    }

    if (!baseSpherical.current) {
      baseSpherical.current = new Spherical().setFromVector3(
        camera.position.clone(),
      );
    }

    const sph = _spherical.current.copy(baseSpherical.current);
    sph.theta += lerped.current.x * THETA_RANGE;
    sph.phi += lerped.current.y * PHI_RANGE;

    camera.position.copy(_vec3.current.setFromSpherical(sph));
    camera.lookAt(0, 0, 0);
  });

  return null;
}
