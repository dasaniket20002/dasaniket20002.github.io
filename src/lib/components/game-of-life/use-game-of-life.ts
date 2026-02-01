import { useCallback, useEffect, useRef } from "react";
import {
  DataTexture,
  RGBAFormat,
  NearestFilter,
  UnsignedByteType,
  LinearFilter,
} from "three";

export interface UseGameOfLifeOptions {
  width: number;
  height: number;
  cellSize: number;
  updateInterval?: number;
  transitionSpeed?: number;
  initialDensity?: number;
}

export interface GameOfLifeState {
  textureRef: React.RefObject<DataTexture | null>;
  columnCount: number;
  rowCount: number;
  update: () => void;
  updateDisplayValues: (deltaTime: number) => void;
  setCell: (x: number, y: number, canvasHeight: number) => void;
  randomize: () => void;
  isReady: () => boolean;
}

interface InternalState {
  currentCells: Float32Array;
  nextCells: Float32Array;
  displayValues: Float32Array;
  textureData: Uint8Array;
  columnCount: number;
  rowCount: number;
  lastUpdateTime: number;
}

export function useGameOfLife({
  width,
  height,
  cellSize,
  transitionSpeed = 5,
  initialDensity = 0.15,
}: UseGameOfLifeOptions): GameOfLifeState {
  const columnCount = Math.max(1, Math.floor(width / cellSize));
  const rowCount = Math.max(1, Math.floor(height / cellSize));

  // Use refs for all mutable state to avoid React compiler issues
  const textureRef = useRef<DataTexture | null>(null);
  const stateRef = useRef<InternalState>({
    currentCells: new Float32Array(0),
    nextCells: new Float32Array(0),
    displayValues: new Float32Array(0),
    textureData: new Uint8Array(0),
    columnCount: 0,
    rowCount: 0,
    lastUpdateTime: 0,
  });

  // Initialize/reinitialize when dimensions change
  useEffect(() => {
    const size = columnCount * rowCount;
    const state = stateRef.current;

    // Initialize cell arrays
    state.currentCells = new Float32Array(size);
    state.nextCells = new Float32Array(size);
    state.displayValues = new Float32Array(size);
    state.textureData = new Uint8Array(size * 4);
    state.columnCount = columnCount;
    state.rowCount = rowCount;

    // Randomize initial state and fill texture data
    for (let i = 0; i < size; i++) {
      const value = Math.random() < initialDensity ? 1 : 0;
      state.currentCells[i] = value;
      state.displayValues[i] = value;

      const val = Math.floor(value * 255);
      const idx = i * 4;
      state.textureData[idx] = val;
      state.textureData[idx + 1] = val;
      state.textureData[idx + 2] = val;
      state.textureData[idx + 3] = 255;
    }

    // Dispose old texture if exists
    if (textureRef.current) {
      textureRef.current.dispose();
    }

    // Create new texture
    const newTexture = new DataTexture(
      state.textureData,
      columnCount,
      rowCount,
      RGBAFormat,
      UnsignedByteType,
    );
    newTexture.minFilter = NearestFilter;
    newTexture.magFilter = LinearFilter;
    newTexture.needsUpdate = true;

    textureRef.current = newTexture;
    state.lastUpdateTime = performance.now();

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, [columnCount, rowCount, initialDensity]);

  // Check if texture is ready
  const isReady = useCallback(() => {
    return textureRef.current !== null;
  }, []);

  // Game of Life update logic
  const update = useCallback(() => {
    const state = stateRef.current;
    const cols = state.columnCount;
    const rows = state.rowCount;
    const current = state.currentCells;
    const next = state.nextCells;

    if (cols === 0 || rows === 0) return;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const left = (col - 1 + cols) % cols;
        const right = (col + 1) % cols;
        const above = (row - 1 + rows) % rows;
        const below = (row + 1) % rows;

        // Count neighbors
        const neighbors =
          current[left + above * cols] +
          current[col + above * cols] +
          current[right + above * cols] +
          current[left + row * cols] +
          current[right + row * cols] +
          current[left + below * cols] +
          current[col + below * cols] +
          current[right + below * cols];

        const idx = col + row * cols;

        // Rules of Life
        if (neighbors < 2 || neighbors > 3) {
          next[idx] = 0;
        } else if (neighbors === 3) {
          next[idx] = 1;
        } else {
          next[idx] = current[idx];
        }
      }
    }

    // Swap arrays
    const temp = state.currentCells;
    state.currentCells = state.nextCells;
    state.nextCells = temp;
  }, []);

  // Update display values with smooth lerping
  const updateDisplayValues = useCallback(
    (deltaTime: number) => {
      const state = stateRef.current;
      const texture = textureRef.current;

      if (!texture || state.columnCount === 0) return;

      const cols = state.columnCount;
      const rows = state.rowCount;
      const current = state.currentCells;
      const display = state.displayValues;
      const data = state.textureData;
      const lerpAmount = 1 - Math.pow(0.01, deltaTime * transitionSpeed);

      const size = cols * rows;
      for (let i = 0; i < size; i++) {
        display[i] += (current[i] - display[i]) * lerpAmount;
        const val = Math.floor(display[i] * 255);
        const idx = i * 4;
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
        data[idx + 3] = 255;
      }

      texture.needsUpdate = true;
    },
    [transitionSpeed],
  );

  // Set cell at position (for mouse interaction)
  const setCell = useCallback(
    (x: number, y: number, canvasHeight: number) => {
      const state = stateRef.current;
      const cols = state.columnCount;
      const rows = state.rowCount;

      if (cols === 0 || rows === 0) return;

      // Flip Y coordinate to match canvas coordinates
      const flippedY = canvasHeight - y;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(flippedY / cellSize);

      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        state.currentCells[col + row * cols] = 1;
      }
    },
    [cellSize],
  );

  // Randomize board
  const randomize = useCallback(() => {
    const state = stateRef.current;
    const size = state.columnCount * state.rowCount;

    if (size === 0) return;

    for (let i = 0; i < size; i++) {
      const value = Math.random() < initialDensity ? 1 : 0;
      state.currentCells[i] = value;
      state.displayValues[i] = value;
    }
    state.lastUpdateTime = performance.now();
  }, [initialDensity]);

  return {
    textureRef,
    columnCount,
    rowCount,
    update,
    updateDisplayValues,
    setCell,
    randomize,
    isReady,
  };
}
