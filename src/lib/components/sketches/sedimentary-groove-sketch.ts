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
  let _w = 0;
  let _h = 0;
  let sedimentShader: p5.default.Shader;
  let noiseTexture: p5.default.Graphics;
  let paletteIdx = 0;
  let isNoiseReady = false;
  let isGenerating = false;
  let loadingProgress = 0;
  let onLoadingChange: ((isLoading: boolean) => void) | undefined;
  let vertShader = "";
  let fragShader = "";

  p5.updateWithProps = (props) => {
    const newW = props.width || p5.windowWidth;
    const newH = props.height || p5.windowHeight;
    onLoadingChange = props.onLoadingChange;

    if (newW !== _w || newH !== _h) {
      _w = newW;
      _h = newH;

      if (_w > 0 && _h > 0) {
        p5.resizeCanvas(_w, _h);
        regenerateNoise();
      }
    }

    vertShader = props.vertShader;
    fragShader = props.fragShader;
  };

  const generateNoiseTextureAsync = async (timestamp: number) => {
    if (_w <= 0 || _h <= 0) return;

    const rez = 0.0025;
    const chunkSize = 10000;

    if (noiseTexture) {
      noiseTexture.remove();
    }
    noiseTexture = p5.createGraphics(_w, _h);
    noiseTexture.pixelDensity(1);
    noiseTexture.loadPixels();

    const totalPixels = _w * _h;
    let processed = 0;

    while (processed < totalPixels) {
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
        noiseTexture.pixels[pos] = Math.floor(n * 255);
        noiseTexture.pixels[pos + 1] = (randMult - 9) * 255;
        noiseTexture.pixels[pos + 2] = 0;
        noiseTexture.pixels[pos + 3] = 255;
      }

      processed = end;
      loadingProgress = processed / totalPixels;

      await yieldToMain();
    }

    noiseTexture.updatePixels();
  };

  const regenerateNoise = async () => {
    if (isGenerating) return;

    isGenerating = true;
    isNoiseReady = false;
    loadingProgress = 0;
    onLoadingChange?.(true);

    paletteIdx = p5.floor(p5.random(colorPalettes.length));

    await generateNoiseTextureAsync(p5.random(0, Date.now()));

    isNoiseReady = true;
    isGenerating = false;
    onLoadingChange?.(false);
    p5.loop();
  };

  p5.setup = async () => {
    p5.createCanvas(_w, _h, p5.WEBGL);
    p5.noStroke();
    p5.pixelDensity(1);

    sedimentShader = p5.createShader(vertShader, fragShader);
    paletteIdx = p5.floor(p5.random(colorPalettes.length));

    onLoadingChange?.(true);

    await generateNoiseTextureAsync(p5.random(0, Date.now()));
    isNoiseReady = true;
    onLoadingChange?.(false);
  };

  p5.draw = () => {
    p5.background(0);

    // Show loading progress bar while generating
    if (!isNoiseReady || isGenerating) {
      p5.resetShader();
      p5.push();
      p5.fill(50);
      p5.noStroke();
      p5.rect(-_w / 4, -5, _w / 2, 10);
      p5.fill(255);
      p5.rect(-_w / 4, -5, (_w / 2) * loadingProgress, 10);
      p5.pop();
      return;
    }

    if (!sedimentShader || !noiseTexture || _w === 0 || _h === 0) {
      return;
    }

    p5.shader(sedimentShader);

    sedimentShader.setUniform("u_noiseTexture", noiseTexture);

    const palette = colorPalettes[paletteIdx];
    for (let i = 0; i < 5; i++) {
      const { h, s, b } = palette[i];
      sedimentShader.setUniform(`u_color${i}`, [h, s, b]);
    }

    p5.plane(_w, _h);
    p5.noLoop();
  };
};
