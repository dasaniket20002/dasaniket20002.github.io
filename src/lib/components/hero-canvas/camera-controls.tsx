// camera-controls.tsx
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { Spherical, Vector2, Vector3 } from "three";
import { useElementSize } from "../../hooks/use-element-size";
import { mapRange } from "../../utils";

const SMOOTHING = 8; // higher = faster convergence
const THETA_RANGE = Math.PI / 64;
const PHI_RANGE = Math.PI / 64;
const EPSILON = 1e-4;

export default function CameraControls({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const { camera } = useThree();
  const canvasSize = useElementSize(canvasRef);

  const pointer = useRef(new Vector2());
  const lerped = useRef(new Vector2());
  const previous = useRef(new Vector2());

  const baseSpherical = useRef<Spherical | null>(null);
  const _spherical = useRef(new Spherical());
  const _vec3 = useRef(new Vector3());

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
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
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [canvasRef, canvasSize]);

  useFrame((state, delta) => {
    previous.current.copy(lerped.current);

    const t = 1 - Math.exp(-SMOOTHING * delta);
    lerped.current.lerp(pointer.current, t);

    // only regress while there is meaningful movement
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
