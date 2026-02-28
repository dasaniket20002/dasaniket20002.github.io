import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

export default function CameraRig({
  enabled,
  z,
}: {
  enabled?: boolean;
  z?: number;
}) {
  useFrame((state, delta) => {
    if (enabled === false) return;

    easing.damp3(
      state.camera.position,
      [
        -1 + (state.pointer.x * state.viewport.width) / 10,
        (1 + state.pointer.y) / 2,
        z ?? 0,
      ],
      0.5,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}
