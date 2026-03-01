import { Text } from "@react-three/drei";
import { DoubleSide, type EulerOrder } from "three";

const INNER_VALUES = [
  0, 2, 4, 6, 8, 8, 6, 4, 2, 0, 0, 2, 4, 6, 8, 8, 6, 4, 2, 0,
];

export function MeterComponent({
  scale = 1,
  position,
  rotation,
}: {
  scale?: number;
  position?: [x: number, y: number, z: number];
  rotation?: [x: number, y: number, z: number, order?: EulerOrder];
}) {
  const radius = 5;
  const innerRadius = radius - 0.05;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* === SEMICIRCLE RING === */}
      <mesh>
        <ringGeometry
          args={[
            innerRadius,
            radius,
            64,
            1,
            -Math.PI, // start angle
            -Math.PI, // length (half circle)
          ]}
        />
        <meshBasicMaterial
          color="gray"
          transparent
          opacity={0.1}
          side={DoubleSide}
        />
      </mesh>

      <mesh>
        <ringGeometry
          args={[
            innerRadius - 0.2,
            radius - 0.2,
            64,
            1,
            -Math.PI, // start angle
            -Math.PI, // length (half circle)
          ]}
        />
        <meshBasicMaterial
          color="red"
          transparent
          opacity={0.1}
          side={DoubleSide}
        />
      </mesh>

      {/* === NUMBERS + TICK MARKS === */}
      {INNER_VALUES.map((value, i) => {
        const t = i / (INNER_VALUES.length - 1);

        // angle across 180 degrees
        const angle = Math.PI - t * Math.PI;

        const textRadius = radius - 1;
        const tickOuter = radius;
        const tickInner = radius - 0.7;

        const textX = Math.cos(angle) * textRadius;
        const textY = Math.sin(angle) * textRadius;

        const tickX = Math.cos(angle) * ((tickOuter + tickInner + 0.5) / 2);
        const tickY = Math.sin(angle) * ((tickOuter + tickInner) / 2);

        return (
          <group key={value}>
            {/* Tick line */}
            <mesh
              position={[tickX, tickY, 0.05]}
              rotation={[0, 0, angle - Math.PI / 2]}
            >
              <boxGeometry args={[0.01, 0.6, 0.05]} />
              <meshBasicMaterial color="gray" transparent opacity={0.5} />
            </mesh>

            {/* Number */}
            <Text
              position={[textX, textY, 0.1]}
              fontSize={0.25}
              color="gray"
              anchorX="center"
              anchorY="middle"
              fillOpacity={0.75}
            >
              {value}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
