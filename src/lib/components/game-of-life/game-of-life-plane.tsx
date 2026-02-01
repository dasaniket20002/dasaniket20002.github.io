import { useFrame, useThree } from "@react-three/fiber";
import type { Rgb } from "culori";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ShaderMaterial, Vector2, Vector3 } from "three";
import fragmentShader from "./gol-fs.glsl?raw";
import vertexShader from "./gol-vs.glsl?raw";
import { useGameOfLife } from "./use-game-of-life";

interface GameOfLifePlaneProps {
  cellSize?: number;
  updateInterval?: number;
  transitionSpeed?: number;
  aliveColor?: Rgb;
  deadColor?: Rgb;
  cornerRadius?: number;
  initialDensity?: number;
}

export function GameOfLifePlane({
  cellSize = 24,
  updateInterval = 120,
  transitionSpeed = 6,
  aliveColor = { mode: "rgb", r: 1, g: 1, b: 1 },
  deadColor = { mode: "rgb", r: 0, g: 0, b: 0 },
  cornerRadius = 0.4,
  initialDensity = 0.1,
}: GameOfLifePlaneProps) {
  const { size, viewport } = useThree();
  const materialRef = useRef<ShaderMaterial>(null);
  const lastUpdateRef = useRef<number>(0);
  const mouseOverRef = useRef(false);

  const {
    textureRef,
    columnCount,
    rowCount,
    update,
    updateDisplayValues,
    setCell,
    isReady,
  } = useGameOfLife({
    width: size.width,
    height: size.height,
    cellSize,
    updateInterval,
    transitionSpeed,
    initialDensity,
  });

  // Create initial uniforms (texture will be updated in useFrame)
  const uniforms = useMemo(
    () => ({
      uCellTexture: { value: null },
      uGridSize: { value: new Vector2(columnCount, rowCount) },
      uAliveColor: {
        value: new Vector3(aliveColor.r, aliveColor.g, aliveColor.b),
      },
      uDeadColor: {
        value: new Vector3(deadColor.r, deadColor.g, deadColor.b),
      },
      uCornerRadius: { value: cornerRadius },
    }),
    [aliveColor, columnCount, cornerRadius, deadColor, rowCount],
  );

  // Update static uniforms when props change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uGridSize.value.set(columnCount, rowCount);
      materialRef.current.uniforms.uAliveColor.value.copy(
        new Vector3(aliveColor.r, aliveColor.g, aliveColor.b),
      );
      materialRef.current.uniforms.uDeadColor.value.copy(
        new Vector3(deadColor.r, deadColor.g, deadColor.b),
      );
      materialRef.current.uniforms.uCornerRadius.value = cornerRadius;
    }
  }, [columnCount, rowCount, aliveColor, deadColor, cornerRadius]);

  const handleMouseMove = useCallback(
    (e: PointerEvent) => {
      if (mouseOverRef.current) setCell(e.offsetX, e.offsetY, size.height);
    },
    [setCell, size.height],
  );

  // Animation frame
  useFrame((state, delta) => {
    if (!isReady() || !materialRef.current) return;

    const currentTime = state.clock.getElapsedTime() * 1000;

    // Update texture uniform every frame
    materialRef.current.uniforms.uCellTexture.value = textureRef.current;

    // Update simulation at fixed interval
    if (currentTime - lastUpdateRef.current >= updateInterval) {
      update();
      lastUpdateRef.current = currentTime;
    }

    // Update display values every frame for smooth transitions
    updateDisplayValues(delta);
  });

  return (
    <mesh
      onPointerEnter={() => {
        mouseOverRef.current = true;
      }}
      onPointerLeave={() => {
        mouseOverRef.current = false;
      }}
      onPointerMove={handleMouseMove}
    >
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
