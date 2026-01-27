import type { Sketch } from "@p5-wrapper/react";
import type { Rgb } from "culori";

export type GolSketchProps = {
  width?: number;
  height?: number;
  aliveColor?: Rgb;
  deadColor?: Rgb;
  cellSize?: number;
  vertShader: string;
  fragShader: string;
};

export const golSketch: Sketch<GolSketchProps> = (p5) => {
  let cellSize: number = 10;
  let width: number = p5.windowWidth;
  let height: number = p5.windowHeight;

  let columnCount: number;
  let rowCount: number;

  let currentCells: number[][] = [];
  let nextCells: number[][] = [];
  let displayValues: number[][] = [];

  // Color variables for dead and alive cells
  let aliveColor: number[];
  let deadColor: number[];

  // Simulation timing
  let lastUpdateTime: number = 0;
  const updateInterval: number = 100;

  // Transition speed for color lerping (higher = faster transition)
  const transitionSpeed: number = 5;

  // Squircle corner radius as fraction of cell size (0-0.5)
  const cornerRadiusFraction: number = 0.4;

  // WebGL shader and texture
  let fragShader: string;
  let vertShader: string;
  let cellShader: p5.default.Shader;
  let cellTexture: p5.default.Image;

  p5.updateWithProps = (props) => {
    fragShader = props.fragShader;
    vertShader = props.vertShader;

    cellSize = props.cellSize || 10;
    width = props.width || p5.windowWidth;
    height = props.height || p5.windowHeight;

    aliveColor = props.aliveColor
      ? [props.aliveColor.r, props.aliveColor.g, props.aliveColor.b]
      : [1, 1, 1];
    deadColor = props.deadColor
      ? [props.deadColor.r, props.deadColor.g, props.deadColor.b]
      : [0, 0, 0];
  };

  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);

    // Calculate columns and rows
    columnCount = p5.floor(width / cellSize);
    rowCount = p5.floor(height / cellSize);

    // Initialize arrays
    for (let column = 0; column < columnCount; column++) {
      currentCells[column] = [];
      nextCells[column] = [];
      displayValues[column] = [];
    }

    // Create shader
    cellShader = p5.createShader(vertShader, fragShader);

    // Create texture to hold cell display values
    cellTexture = p5.createImage(columnCount, rowCount);

    randomizeBoard();
    p5.noStroke();

    p5.describe(
      "Grid of squircles that smoothly transition between colors, demonstrating a simulation of John Conway's Game of Life. Mouse over cells to bring them to life.",
    );
  };

  p5.draw = () => {
    if (
      !aliveColor ||
      !deadColor ||
      !cellSize ||
      !width ||
      !height ||
      !cellShader
    )
      return;

    p5.background(deadColor);

    // Handle mouse interaction with bounds checking
    const mx = p5.mouseX;
    const my = height - 1 - p5.mouseY;

    if (mx >= 0 && mx < width && my >= 0 && my < height) {
      const gridX = p5.floor(mx / cellSize);
      const gridY = p5.floor(my / cellSize);
      if (gridX >= 0 && gridX < columnCount && gridY >= 0 && gridY < rowCount) {
        currentCells[gridX][gridY] = 1;
      }
    }

    // Calculate frame-rate independent lerp amount
    const dt = p5.deltaTime / 1000; // Convert milliseconds to seconds
    const lerpAmount = 1 - p5.pow(0.01, dt * transitionSpeed);

    // Update display values and update texture
    cellTexture.loadPixels();
    for (let column = 0; column < columnCount; column++) {
      for (let row = 0; row < rowCount; row++) {
        const targetValue = currentCells[column][row];
        displayValues[column][row] = p5.lerp(
          displayValues[column][row],
          targetValue,
          lerpAmount,
        );

        // Write display value to texture (row-major order)
        const idx = (row * columnCount + column) * 4;
        const val = p5.floor(displayValues[column][row] * 255);
        cellTexture.pixels[idx + 0] = val; // R
        cellTexture.pixels[idx + 1] = val; // G
        cellTexture.pixels[idx + 2] = val; // B
        cellTexture.pixels[idx + 3] = 255; // A
      }
    }
    cellTexture.updatePixels();

    // Render with shader
    p5.shader(cellShader);
    cellShader.setUniform("uCellTexture", cellTexture);
    cellShader.setUniform("uGridSize", [columnCount, rowCount]);
    cellShader.setUniform("uCornerRadius", cornerRadiusFraction);
    cellShader.setUniform("uAliveColor", aliveColor);
    cellShader.setUniform("uDeadColor", deadColor);

    // Draw full-screen quad
    p5.plane(width, height);

    // Update simulation at fixed interval
    const currTime = p5.millis();
    if (currTime - lastUpdateTime >= updateInterval) {
      update();
      lastUpdateTime = currTime;
    }
  };

  // Fill board randomly
  function randomizeBoard() {
    for (let column = 0; column < columnCount; column++) {
      for (let row = 0; row < rowCount; row++) {
        // Randomly select value of either 0 (dead) or 1 (alive)
        const value = p5.random([0, 0, 0, 0, 0, 0, 0, 0, 1]);
        currentCells[column][row] = value;
        displayValues[column][row] = value;
      }
    }
    lastUpdateTime = p5.millis();
  }

  // Create a new generation
  function update() {
    // Loop through every spot in our 2D array and count living neighbors
    for (let column = 0; column < columnCount; column++) {
      for (let row = 0; row < rowCount; row++) {
        // Column left of current cell (wraps around)
        const left = (column - 1 + columnCount) % columnCount;

        // Column right of current cell (wraps around)
        const right = (column + 1) % columnCount;

        // Row above current cell (wraps around)
        const above = (row - 1 + rowCount) % rowCount;

        // Row below current cell (wraps around)
        const below = (row + 1) % rowCount;

        // Count living neighbors surrounding current cell
        const neighbours =
          currentCells[left][above] +
          currentCells[column][above] +
          currentCells[right][above] +
          currentCells[left][row] +
          currentCells[right][row] +
          currentCells[left][below] +
          currentCells[column][below] +
          currentCells[right][below];

        // Rules of Life
        if (neighbours < 2 || neighbours > 3) {
          // 1. Any live cell with fewer than two live neighbours dies
          // 2. Any live cell with more than three live neighbours dies
          nextCells[column][row] = 0;
        } else if (neighbours === 3) {
          // 4. Any dead cell with exactly three live neighbours comes to life
          nextCells[column][row] = 1;
        } else {
          // 3. Any live cell with two or three live neighbours lives unchanged
          nextCells[column][row] = currentCells[column][row];
        }
      }
    }

    // Swap the current and next arrays for next generation
    const temp = currentCells;
    currentCells = nextCells;
    nextCells = temp;
  }

  p5.windowResized = () => {
    p5.resizeCanvas(width, height);

    columnCount = p5.floor(width / cellSize);
    rowCount = p5.floor(height / cellSize);

    currentCells = [];
    nextCells = [];
    displayValues = [];

    // Initialize arrays
    for (let column = 0; column < columnCount; column++) {
      currentCells[column] = [];
      nextCells[column] = [];
      displayValues[column] = [];
    }

    randomizeBoard();
  };

  p5.mousePressed = () => {
    // Reset simulation when mouse is clicked
    // randomizeBoard();
  };
};
