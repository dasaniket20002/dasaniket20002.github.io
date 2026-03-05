import { extend } from "@react-three/fiber";
import type { JSX } from "react";
import {
  Color,
  Matrix4,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector4,
} from "three";

import fragmentShader from "./fragment-shader.glsl?raw";
import vertexShader from "./vertex-shader.glsl?raw";

const customUniforms = {
  uInverseProjectionMatrix: { value: new Matrix4() },
  uCameraMatrix: { value: new Matrix4() },
  uProjectionMatrix: { value: new Matrix4() },
  uBounds: { value: new Vector4() },
  uBalls: { value: Array.from({ length: 32 }, () => new Vector4()) },
  uCount: { value: 0 },
  uSmooth: { value: 0.5 },
  uBaseColor: { value: new Color(1, 1, 1) },
  uRoughness: { value: 0.35 },
  uMetalness: { value: 0.0 },
  uStepThreshold: { value: 0.001 },
  uStepFactor: { value: 0.9 },
};

class MetaballMaterial extends ShaderMaterial {
  static key = Math.random().toString(36).slice(2);

  constructor(params: Record<string, unknown> = {}) {
    const uniforms = UniformsUtils.merge([UniformsLib.lights, customUniforms]);

    super({
      vertexShader,
      fragmentShader,
      uniforms,
      lights: true,
      transparent: true,
      depthWrite: true,
    });

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (this.uniforms[k]) {
          this.uniforms[k].value = v;
        }
      }
    }
  }
}

extend({ MetaballMaterial });
export { MetaballMaterial };

declare module "@react-three/fiber" {
  interface ThreeElements {
    metaballMaterial: JSX.IntrinsicElements["shaderMaterial"] & {
      uSmooth?: number;
      uBaseColor?: Color;
      uRoughness?: number;
      uMetalness?: number;
      uStepThreshold?: number;
      uStepFactor?: number;
    };
  }
}
