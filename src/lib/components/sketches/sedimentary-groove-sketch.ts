/* Sedimentary Groove short version by Steve's Makerspace 
video: https://youtu.be/onemNhgAVg8
*/

import type { Sketch } from "@p5-wrapper/react";
import { yieldToMain } from "../../utils";

export type SedimentaryGrooveProps = {
  width?: number;
  height?: number;
  onLoadingChange?: (isLoading: boolean) => void;
  fragShader: string;
  vertShader: string;
};

const colorPalettes = [
  [
    { h: 161, s: 55, b: 50 },
    { h: 55, s: 82, b: 87 },
    { h: 31, s: 90, b: 97 },
    { h: 17, s: 47, b: 49 },
    { h: 95, s: 86, b: 35 },
  ],
  [
    { h: 30, s: 58, b: 90 },
    { h: 67, s: 102, b: 51 },
    { h: 32, s: 98, b: 91 },
    { h: 339, s: 100, b: 70 },
    { h: 311, s: 86, b: 49 },
  ],
  [
    { h: 39, s: 45, b: 89 },
    { h: 27, s: 120, b: 99 },
    { h: 180, s: 120, b: 56 },
    { h: 39, s: 120, b: 76 },
    { h: 350, s: 100, b: 76 },
  ],
  [
    { h: 175, s: 30, b: 65 },
    { h: 215, s: 68, b: 68 },
    { h: 15, s: 92, b: 98 },
    { h: 356, s: 84, b: 90 },
    { h: 38, s: 92, b: 98 },
  ],
  [
    { h: 150, s: 65, b: 60 },
    { h: 55, s: 92, b: 97 },
    { h: 23, s: 43, b: 47 },
    { h: 180, s: 86, b: 60 },
    { h: 120, s: 86, b: 40 },
  ],
];

export const sedimentaryGrooveSketch: Sketch<SedimentaryGrooveProps> = (p5) => {
  // Initialize ALL variables with default values
  let _w = 0;
  let _h = 0;
  let sedimentShader: p5.default.Shader | null = null;
  let noiseTexture: p5.default.Graphics | null = null;
  let paletteIdx = 0;
  let isNoiseReady = false;
  let isGenerating = false;
  let isSetupComplete = false;
  let pendingRegeneration = false;
  let generationId = 0; // Track generation to handle race conditions
  let onLoadingChange: ((isLoading: boolean) => void) | undefined;
  let vertShader = "";
  let fragShader = "";

  p5.updateWithProps = (props) => {
    // Store shaders FIRST - before any dimension checks
    if (props.vertShader) vertShader = props.vertShader;
    if (props.fragShader) fragShader = props.fragShader;
    onLoadingChange = props.onLoadingChange;

    const newW = props.width || 0;
    const newH = props.height || 0;

    // Skip if dimensions are invalid
    if (newW <= 0 || newH <= 0) return;

    const dimensionsChanged = newW !== _w || newH !== _h;
    _w = newW;
    _h = newH;

    if (dimensionsChanged) {
      if (isSetupComplete) {
        p5.resizeCanvas(_w, _h);
        regenerateNoise();
      } else {
        // Mark for regeneration after setup completes
        pendingRegeneration = true;
      }
    }
  };

  const generateNoiseTextureAsync = async (
    currentGenerationId: number
  ): Promise<boolean> => {
    if (_w <= 0 || _h <= 0) return false;

    const rez = 0.0025;
    const chunkSize = 2000;
    const timestamp = p5.random(0, Date.now());

    // Cleanup previous texture
    if (noiseTexture) {
      noiseTexture.remove();
      noiseTexture = null;
    }

    // Create new graphics buffer
    const newTexture = p5.createGraphics(_w, _h);
    newTexture.pixelDensity(1);
    newTexture.loadPixels();

    const totalPixels = _w * _h;
    let processed = 0;

    while (processed < totalPixels) {
      // Check if this generation was superseded
      if (currentGenerationId !== generationId) {
        newTexture.remove();
        return false;
      }

      const end = Math.min(processed + chunkSize, totalPixels);

      for (let i = processed; i < end; i++) {
        const x = i % _w;
        const y = Math.floor(i / _w);

        let n = p5.noise((x + timestamp) * rez, (y + timestamp) * rez) + 0.033;
        n = p5.map(n, 0.3, 0.7, 0, 1);
        if (n < 0) n += 1;
        if (n > 1) n -= 1;

        const randMult = p5.floor(p5.random(9, 11));

        const pos = i * 4;
        newTexture.pixels[pos] = Math.floor(n * 255);
        newTexture.pixels[pos + 1] = (randMult - 9) * 255;
        newTexture.pixels[pos + 2] = 0;
        newTexture.pixels[pos + 3] = 255;
      }

      processed = end;
      await yieldToMain();
    }

    // Final check before committing
    if (currentGenerationId !== generationId) {
      newTexture.remove();
      return false;
    }

    newTexture.updatePixels();
    noiseTexture = newTexture;
    return true;
  };

  const regenerateNoise = async () => {
    // Prevent concurrent generation
    if (isGenerating) {
      pendingRegeneration = true;
      return;
    }

    // Validate state
    if (!isSetupComplete || _w <= 0 || _h <= 0) {
      pendingRegeneration = true;
      return;
    }

    isGenerating = true;
    isNoiseReady = false;
    pendingRegeneration = false;
    onLoadingChange?.(true);

    // Increment generation ID to invalidate any in-progress generation
    const currentGenerationId = ++generationId;

    // Randomize palette
    paletteIdx = p5.floor(p5.random(colorPalettes.length));

    const success = await generateNoiseTextureAsync(currentGenerationId);

    // Only update state if this generation is still valid
    if (success && currentGenerationId === generationId) {
      isNoiseReady = true;
      onLoadingChange?.(false);
      p5.loop(); // Trigger redraw
    }

    isGenerating = false;

    // Handle any pending regeneration requests
    if (pendingRegeneration) {
      regenerateNoise();
    }
  };

  p5.setup = async () => {
    // Wait for valid dimensions
    if (_w <= 0 || _h <= 0) {
      // Retry setup on next frame
      requestAnimationFrame(() => {
        if (!isSetupComplete) {
          p5.setup?.();
        }
      });
      return;
    }

    // Wait for shaders to be available
    if (!vertShader || !fragShader) {
      requestAnimationFrame(() => {
        if (!isSetupComplete) {
          p5.setup?.();
        }
      });
      return;
    }

    p5.createCanvas(_w, _h, p5.WEBGL);
    p5.pixelDensity(1);
    p5.noStroke();

    // Create shader
    try {
      sedimentShader = p5.createShader(vertShader, fragShader);
    } catch (e) {
      console.error("Failed to create shader:", e);
      return;
    }

    isSetupComplete = true;

    // Process any pending regeneration
    await regenerateNoise();
  };

  p5.draw = () => {
    // Clear with transparent background
    p5.clear();

    // Guard: ensure everything is ready
    if (
      !isSetupComplete ||
      !sedimentShader ||
      !noiseTexture ||
      !isNoiseReady ||
      _w <= 0 ||
      _h <= 0
    ) {
      return;
    }

    try {
      p5.shader(sedimentShader);

      sedimentShader.setUniform("u_noiseTexture", noiseTexture);

      const palette = colorPalettes[paletteIdx];
      for (let i = 0; i < 5; i++) {
        const { h, s, b } = palette[i];
        sedimentShader.setUniform(`u_color${i}`, [h, s, b]);
      }

      p5.plane(_w, _h);
      p5.resetShader();
    } catch (e) {
      console.error("Draw error:", e);
    }

    p5.noLoop();
  };

  p5.remove = () => {
    if (noiseTexture) {
      noiseTexture.remove();
      noiseTexture = null;
    }
    isSetupComplete = false;
    isNoiseReady = false;
    isGenerating = false;
    generationId++;
  };
};
