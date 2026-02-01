import { Canvas } from "@react-three/fiber";
import { GameOfLifePlane } from "./game-of-life-plane";
import { useMemo } from "react";
import { converter } from "culori";
import { getColorPropertyValue } from "../../utils";

export function GameOfLifeCanvas() {
  const aliveColor = useMemo(
    () => converter("rgb")(getColorPropertyValue("light-2")),
    [],
  );
  const deadColor = useMemo(
    () => converter("rgb")(getColorPropertyValue("light-1")),
    [],
  );
  return (
    <Canvas
      orthographic
      camera={{
        zoom: 1,
        position: [0, 0, 100],
        near: 0.1,
        far: 1000,
      }}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <GameOfLifePlane aliveColor={aliveColor} deadColor={deadColor} />
    </Canvas>
  );
}
