import { type PerformanceRating } from "../contexts/use-performance-metrics";

export type QualitySettings = {
  useCameraControls: boolean;
  usePostProcessing: boolean;
  shadowMapRes: number;
  effectRes: number;
  reflectorRes: number;
  renderTexRes: number;
};

const HIGH: QualitySettings = {
  useCameraControls: true,
  usePostProcessing: true,
  shadowMapRes: 512,
  effectRes: 896,
  reflectorRes: 512,
  renderTexRes: 384,
};

const MEDIUM: QualitySettings = {
  useCameraControls: true,
  usePostProcessing: true,
  shadowMapRes: 256,
  effectRes: 512,
  reflectorRes: 256,
  renderTexRes: 256,
};

const LOW: QualitySettings = {
  useCameraControls: true,
  usePostProcessing: false,
  shadowMapRes: 128,
  effectRes: 256,
  reflectorRes: 128,
  renderTexRes: 128,
};

const QUALITY_MAP = { high: HIGH, medium: MEDIUM, low: LOW } as const;

export function useQualitySettings(performanceRating?: PerformanceRating) {
  if (!performanceRating) return QUALITY_MAP["high"];
  return QUALITY_MAP[performanceRating];
}
