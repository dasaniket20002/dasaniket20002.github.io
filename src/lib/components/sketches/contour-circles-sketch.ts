import type { Sketch } from "@p5-wrapper/react";
import { colorPalettes } from "../../utils";
import { converter, type Rgb } from "culori";

export type ContourCirclesProps = {
  vertShader: string;
  fragShader: string;
  width?: number;
  height?: number;
  color1?: Rgb;
  color2?: Rgb;
};

export const contourCircleSketch: Sketch<ContourCirclesProps> = (p5) => {
  let shader: p5.default.Shader;
  const centers: number[][] = [];
  let vertShader: string;
  let fragShader: string;
  let width: number = 0;
  let height: number = 0;
  let color1: Rgb = { mode: "rgb", r: 1, g: 1, b: 1 };
  let color2: Rgb = { mode: "rgb", r: 0, g: 0, b: 0 };

  p5.updateWithProps = (props) => {
    vertShader = props.vertShader;
    fragShader = props.fragShader;

    const paletteIdx = p5.floor(p5.random(colorPalettes.length));
    const color1Idx = p5.floor(p5.random(colorPalettes[paletteIdx].length));
    let color2Idx = p5.floor(p5.random(colorPalettes[paletteIdx].length));
    while (color1Idx === color2Idx)
      color2Idx = p5.floor(p5.random(colorPalettes[paletteIdx].length));

    color1 =
      props.color1 || converter("rgb")(colorPalettes[paletteIdx][color1Idx]);
    color2 =
      props.color2 || converter("rgb")(colorPalettes[paletteIdx][color2Idx]);

    const newW = props.width || p5.windowWidth;
    const newH = props.height || p5.windowHeight;

    if (newW <= 0 || newH <= 0) return;

    width = newW;
    height = newH;

    if (newW !== width || newH !== height) {
      p5.resizeCanvas(width, height);
    }
  };

  p5.setup = () => {
    p5.createCanvas(width, height, p5.WEBGL);

    p5.noStroke();
    p5.pixelDensity(1);
    p5.colorMode(p5.OKLCH);
    shader = p5.createShader(vertShader, fragShader);

    // Random circle centers
    for (let i = 0; i < 8; i++) {
      centers.push([
        p5.random(-0.5, 0.5),
        p5.random(-0.5, 0.5),
        p5.random(0.15, 0.35), // radius influence
      ]);
    }
  };

  p5.draw = () => {
    p5.clear();
    p5.shader(shader);

    shader.setUniform("u_resolution", [width, height]);
    shader.setUniform("u_time", p5.millis() * 0.001);
    shader.setUniform("u_centers", centers.flat());
    shader.setUniform("u_count", centers.length);

    shader.setUniform("u_color1", [color1.r, color1.g, color1.b]);
    shader.setUniform("u_color2", [color2.r, color2.g, color2.b]);

    p5.plane(width, height);

    p5.resetShader();
  };
};
