import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion";
import { useWindowSize } from "../../hooks/use-window-size";
import { useEffect, useRef } from "react";
import { Spherical, Vector2, Vector3 } from "three";
import { mapRange } from "../../utils";

export default function CameraControls({
  pointerX,
  pointerY,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const { camera } = useThree();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const pointer = useRef(new Vector2());
  const lerped = useRef(new Vector2());
  const previous = useRef(new Vector2());

  const baseSpherical = useRef<Spherical | null>(null);

  useEffect(() => {
    const unsubX = pointerX.on("change", (latest) => {
      pointer.current.x = mapRange(latest, 0, windowWidth - 1, 0, 1);
    });
    const unsubY = pointerY.on("change", (latest) => {
      pointer.current.y = mapRange(latest, 0, windowHeight - 1, 0, 1);
    });

    return () => {
      unsubX();
      unsubY();
    };
  }, [pointerX, pointerY, windowHeight, windowWidth]);

  useFrame((state, delta) => {
    previous.current.copy(lerped.current);
    lerped.current.lerp(pointer.current, 0.5);

    // Regress system when the pointer is moved (nice perf trick)
    if (!previous.current.equals(lerped.current)) state.performance.regress();

    if (!baseSpherical.current) {
      const v = camera.position.clone();
      baseSpherical.current = new Spherical().setFromVector3(v);
    }

    const spherical = baseSpherical.current.clone();

    spherical.theta += lerped.current.x * (Math.PI / 16) * delta * 5;
    spherical.phi += lerped.current.y * (Math.PI / 16) * delta * 5;

    const nextPos = new Vector3().setFromSpherical(spherical);
    camera.position.copy(nextPos);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
