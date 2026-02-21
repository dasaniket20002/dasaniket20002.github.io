import { type PerformanceRating } from "../contexts/use-performance-metrics";

export type QualitySettings = {
  animateSurrounds: boolean;
  loopPoiAnimation: boolean;
  surroundAnimations?: {
    initial: number[];
    loop: number[];
    loopDuration: number;
  }[];
  useCameraControls: boolean;
  usePostProcessing: boolean;
  shadowMapRes: number;
  effectRes: number;
  useSSAO: boolean;
};

const HIGH: QualitySettings = {
  animateSurrounds: true,
  loopPoiAnimation: true,
  surroundAnimations: [
    { initial: [-8, -4], loop: [-4, -4.5, -4], loopDuration: 12 },
    { initial: [-16, -8], loop: [-8, -9, -8], loopDuration: 16 },
    { initial: [-10, -8], loop: [-8, -8.5, -8], loopDuration: 24 },
  ],
  useCameraControls: true,
  usePostProcessing: true,
  shadowMapRes: 1024,
  effectRes: 720,
  useSSAO: true,
};

const MEDIUM: QualitySettings = {
  animateSurrounds: false,
  loopPoiAnimation: true,
  useCameraControls: true,
  usePostProcessing: true,
  shadowMapRes: 512,
  effectRes: 480,
  useSSAO: false,
};

const LOW: QualitySettings = {
  animateSurrounds: false,
  loopPoiAnimation: false,
  useCameraControls: false,
  usePostProcessing: false,
  shadowMapRes: 256,
  effectRes: 320,
  useSSAO: false,
};

const QUALITY_MAP = { high: HIGH, medium: MEDIUM, low: LOW } as const;

export function useQualitySettings(performanceRating?: PerformanceRating) {
  if (!performanceRating) return QUALITY_MAP["medium"];
  return QUALITY_MAP[performanceRating];
}
