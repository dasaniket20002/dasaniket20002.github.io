import { type PerformanceRating } from "../contexts/use-performance-metrics";

export type QualitySettings = {
  useCameraControls: boolean;
  usePostProcessing: boolean;
  shadowMapRes: number;
  effectRes: number;
};

const HIGH: QualitySettings = {
  useCameraControls: true,
  usePostProcessing: true,
  shadowMapRes: 1024,
  effectRes: 768,
};

const MEDIUM: QualitySettings = {
  useCameraControls: true,
  usePostProcessing: true,
  shadowMapRes: 512,
  effectRes: 512,
};

const LOW: QualitySettings = {
  useCameraControls: false,
  usePostProcessing: false,
  shadowMapRes: 256,
  effectRes: 320,
};

const QUALITY_MAP = { high: HIGH, medium: MEDIUM, low: LOW } as const;

export function useQualitySettings(performanceRating?: PerformanceRating) {
  if (!performanceRating) return QUALITY_MAP["high"];
  return QUALITY_MAP[performanceRating];
}
