import { useMemo } from "react";
import type { Color, EulerOrder } from "three";

export function DotField({
  position,
  rotation,
  scale,
  color = "black",
  opacity = 1,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number, order?: EulerOrder];
  scale?: number;
  color?: Color | string;
  opacity?: number;
}) {
  const points = useMemo(() => {
    const positions: number[] = [];
    const size = 10;
    const step = 1;

    for (let x = -size; x <= size; x += step) {
      for (let y = -size; y <= size; y += step) {
        if ((x + y) % 4 === 0) {
          positions.push(x, y, 0);
        }
      }
    }

    return new Float32Array(positions);
  }, []);

  return (
    <points position={position} rotation={rotation} scale={scale}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.2} color={color} transparent opacity={opacity} />
    </points>
  );
}

export function CubeScatter({
  position,
  rotation,
  scale,
  color = "black",
  opacity = 1,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number, order?: EulerOrder];
  scale?: number;
  color?: Color | string;
  opacity?: number;
}) {
  const positions: [number, number, number][] = [
    [-15, 10, -5],
    [12, 8, -8],
    [-8, -12, -6],
    [15, -10, -12],
    [5, -5, -15],
  ];

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial
            color={color}
            wireframe
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

export function RadialLines({
  position,
  rotation,
  scale,
  color = "black",
  opacity = 1,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number, order?: EulerOrder];
  scale?: number;
  color?: Color | string;
  opacity?: number;
}) {
  const lines = useMemo(() => {
    const segments = 8;
    const radius = 40;
    const positions: number[] = [];

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      positions.push(
        0,
        0,
        0,
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0,
      );
    }

    return new Float32Array(positions);
  }, []);

  return (
    <lineSegments position={position} rotation={rotation} scale={scale}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lines.length / 3}
          array={lines}
          itemSize={3}
          args={[lines, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}
