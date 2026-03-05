import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Color, NormalBlending, Vector4 } from "three";
import { useCloudSimContext, type CloudBallsData } from "./cloud-sim-context";
import { MetaballMaterial } from "./metaball-material";

interface CloudVisualsProps {
  ballConfigs: CloudBallsData[];
  smoothness: number;
  baseColor: Color;
  roughness?: number;
  metalness?: number;
  position?: [number, number, number];
}

export default function CloudVisualsClient({
  ballConfigs,
  smoothness,
  baseColor,
  roughness = 0.1,
  metalness = 0.0,
  position,
}: CloudVisualsProps) {
  const matRef = useRef<MetaballMaterial>(null!);
  const { registryRef } = useCloudSimContext();

  useFrame(({ camera }) => {
    const m = matRef.current;
    if (!m) return;

    const u = m.uniforms;

    // ── Matrices: now uniforms instead of varyings ──────────
    u.uProjectionMatrix.value.copy(camera.projectionMatrix);
    u.uInverseProjectionMatrix.value.copy(camera.projectionMatrixInverse);
    u.uCameraMatrix.value.copy(camera.matrixWorld);

    // ── Ball positions ──────────────────────────────────────
    const balls = u.uBalls.value as Vector4[];
    let count = 0;
    let cx = 0,
      cy = 0,
      cz = 0;

    for (let i = 0; i < ballConfigs.length; i++) {
      const body = registryRef.current.get(i);
      if (body) {
        const pos = body.translation();
        balls[i].set(pos.x, pos.y, pos.z, ballConfigs[i].r);
      } else {
        balls[i].set(
          ballConfigs[i].x,
          ballConfigs[i].y,
          ballConfigs[i].z,
          ballConfigs[i].r,
        );
      }
      cx += balls[i].x;
      cy += balls[i].y;
      cz += balls[i].z;
      count++;
    }

    // ── Bounding sphere (CPU-side) ──────────────────────────
    if (count > 0) {
      cx /= count;
      cy /= count;
      cz /= count;

      let radius = 0;
      for (let i = 0; i < count; i++) {
        const dx = balls[i].x - cx;
        const dy = balls[i].y - cy;
        const dz = balls[i].z - cz;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + balls[i].w;
        if (d > radius) radius = d;
      }
      radius += smoothness; // account for smin bloat

      u.uBounds.value.set(cx, cy, cz, radius);
    }

    // ── Scalars / colors ────────────────────────────────────
    u.uCount.value = count;
    u.uSmooth.value = smoothness;
    u.uBaseColor.value.set(baseColor);
    u.uRoughness.value = roughness;
    u.uMetalness.value = metalness;

    u.uStepThreshold.value = 0.005;
    u.uStepFactor.value = 1.2;
  });

  return (
    <mesh position={position}>
      <planeGeometry args={[2, 2]} />
      <metaballMaterial
        ref={matRef}
        key={MetaballMaterial.key}
        blending={NormalBlending}
      />
    </mesh>
  );
}
